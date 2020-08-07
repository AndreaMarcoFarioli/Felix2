import { spawn, exec, execSync } from "child_process";
import { parentPort, workerData } from "worker_threads";
import { pw } from "../configuration/structure";
let executor_vpn = spawn("sudo-vpn", [workerData.country]);

let out = setTimeout(() => {
    parentPort?.postMessage("refresh");
    exit();
}, 20000);

executor_vpn.stdout.on("data", (data: Buffer) => {
    let sdata = data.toString("ascii");
    if (sdata.toLowerCase().includes("sequence completed")){
        console.log(sdata)
        parentPort?.postMessage("start");
        clearTimeout(out);
    }
});

parentPort?.on("message", (data) => {
    if (data === "exit") {
        exit();
    }
})

function exit() {
    executor_vpn.kill();
    process.exit();
}
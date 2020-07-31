import { spawn, exec } from "child_process";
import { parentPort, workerData } from "worker_threads";
import { pw } from "../configuration/structure";
let executor_vpn = spawn("sudo-vpn", [workerData.country]);

let out = setTimeout(() => {
    parentPort?.postMessage("refresh");
    exit();
}, 10000);

executor_vpn.stdout.on("data", (data: Buffer) => {
    let sdata = data.toString("ascii");
    if (sdata.toLowerCase().includes("sequence completed"))
        parentPort?.postMessage("start");
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
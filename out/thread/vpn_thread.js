"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var worker_threads_1 = require("worker_threads");
var executor_vpn = child_process_1.spawn("sudo-vpn", [worker_threads_1.workerData.country]);
var out = setTimeout(function () {
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("refresh");
    exit();
}, 20000);
executor_vpn.stdout.on("data", function (data) {
    var sdata = data.toString("ascii");
    if (sdata.toLowerCase().includes("sequence completed")) {
        console.log(sdata);
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage("start");
        clearTimeout(out);
    }
});
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on("message", function (data) {
    if (data === "exit") {
        exit();
    }
});
function exit() {
    executor_vpn.kill();
    process.exit();
}

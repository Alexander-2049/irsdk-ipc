"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const irsdkIPC_1 = require("./irsdkIPC");
const { SESSION_INFO_UPDATE_INTERVAL, TELEMETRY_UPDATE_INTERVAL } = (0, utils_1.getExecutionArguments)();
console.log("[IRSDK-IPC] TELEMETRY UPDATE INTERVAL: " + TELEMETRY_UPDATE_INTERVAL + "ms");
console.log("[IRSDK-IPC] SESSION INFO UPDATE INTERVAL: " +
    SESSION_INFO_UPDATE_INTERVAL +
    "ms");
const irsdkwss = new irsdkIPC_1.irsdkIPC({
    sessionInfoUpdateInterval: SESSION_INFO_UPDATE_INTERVAL,
    telemetryUpdateInterval: TELEMETRY_UPDATE_INTERVAL,
});
process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

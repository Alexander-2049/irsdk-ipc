import { getExecutionArguments } from "./utils";
import { irsdkIPC } from "./irsdkIPC";

const { SESSION_INFO_UPDATE_INTERVAL, TELEMETRY_UPDATE_INTERVAL } =
  getExecutionArguments();

console.log(
  "[IRSDK-IPC] TELEMETRY UPDATE INTERVAL: " + TELEMETRY_UPDATE_INTERVAL + "ms"
);
console.log(
  "[IRSDK-IPC] SESSION INFO UPDATE INTERVAL: " +
    SESSION_INFO_UPDATE_INTERVAL +
    "ms"
);

const irsdkwss = new irsdkIPC({
  sessionInfoUpdateInterval: SESSION_INFO_UPDATE_INTERVAL,
  telemetryUpdateInterval: TELEMETRY_UPDATE_INTERVAL,
});

process.on("uncaughtException", (err: Error) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.irsdkIPC = void 0;
const node_irsdk_2023_1 = __importDefault(require("node-irsdk-2023"));
class irsdkIPC {
    constructor({ sessionInfoUpdateInterval, telemetryUpdateInterval, }) {
        this.sessionInfoUpdateInterval = sessionInfoUpdateInterval;
        this.telemetryUpdateInterval = telemetryUpdateInterval;
        const iracing = node_irsdk_2023_1.default.init({
            telemetryUpdateInterval: this.telemetryUpdateInterval,
            sessionInfoUpdateInterval: this.sessionInfoUpdateInterval,
        });
        iracing.on("Telemetry", (telemetryEvent) => {
            if (!process.send)
                return;
            process.send(telemetryEvent);
        });
        iracing.on("SessionInfo", (sessionEvent) => {
            if (!process.send)
                return;
            process.send(sessionEvent);
        });
        iracing.on("Connected", () => {
            if (!process.send)
                return;
            process.send({ connected: true });
        });
        iracing.on("Disconnected", () => {
            if (!process.send)
                return;
            process.send({ connected: false });
        });
    }
}
exports.irsdkIPC = irsdkIPC;

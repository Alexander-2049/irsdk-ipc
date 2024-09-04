"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.irsdkIPC = void 0;
const node_irsdk_2023_1 = __importDefault(require("node-irsdk-2023"));
class irsdkIPC {
    constructor({ sessionInfoUpdateInterval, telemetryUpdateInterval, }) {
        this.lastTelemetryEvent = {
            type: "Telemetry",
            data: null,
            timestamp: new Date(),
        };
        this.lastSessionInfoEvent = {
            type: "SessionInfo",
            data: null,
            timestamp: new Date(),
        };
        this.lastConnectedEvent = {
            data: false,
            timestamp: new Date(),
            type: "Connected",
        };
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
            this.lastTelemetryEvent = telemetryEvent;
        });
        iracing.on("SessionInfo", (sessionEvent) => {
            if (!process.send)
                return;
            process.send(sessionEvent);
            this.lastSessionInfoEvent = sessionEvent;
        });
        iracing.on("Connected", () => {
            this.lastConnectedEvent = Object.assign(Object.assign({}, this.lastConnectedEvent), { data: true, timestamp: new Date() });
            if (!process.send)
                return;
            process.send(this.lastConnectedEvent);
        });
        iracing.on("Disconnected", () => {
            this.lastConnectedEvent = Object.assign(Object.assign({}, this.lastConnectedEvent), { data: false, timestamp: new Date() });
            if (!process.send)
                return;
            process.send(this.lastConnectedEvent);
        });
        process.on("message", (message) => {
            if (!process.send || typeof message !== "string")
                return;
            message = message.toLowerCase();
            if (message === "telemetry") {
                process.send(this.lastTelemetryEvent);
            }
            else if (message === "connected") {
                process.send(this.lastConnectedEvent);
            }
            else if (message === "sessioninfo") {
                process.send(this.lastSessionInfoEvent);
            }
        });
    }
}
exports.irsdkIPC = irsdkIPC;

import irsdk from "node-irsdk-2023";
import { SessionInfoEvent, TelemetryEvent } from "node-irsdk-2023/src/JsIrSdk";

interface ConnectedEvent {
  type: "Connected";
  data: boolean;
  timestamp: Date;
}

export class irsdkIPC {
  private sessionInfoUpdateInterval: number;
  private telemetryUpdateInterval: number;
  private lastTelemetryEvent: null | TelemetryEvent = null;
  private lastSessionInfoEvent: null | SessionInfoEvent = null;
  private lastConnectedEvent: ConnectedEvent = {
    data: false,
    timestamp: new Date(),
    type: "Connected",
  };

  constructor({
    sessionInfoUpdateInterval,
    telemetryUpdateInterval,
  }: {
    sessionInfoUpdateInterval: number;
    telemetryUpdateInterval: number;
  }) {
    this.sessionInfoUpdateInterval = sessionInfoUpdateInterval;
    this.telemetryUpdateInterval = telemetryUpdateInterval;

    const iracing = irsdk.init({
      telemetryUpdateInterval: this.telemetryUpdateInterval,
      sessionInfoUpdateInterval: this.sessionInfoUpdateInterval,
    });

    iracing.on("Telemetry", (telemetryEvent) => {
      if (!process.send) return;
      process.send(telemetryEvent);
      this.lastTelemetryEvent = telemetryEvent;
    });

    iracing.on("SessionInfo", (sessionEvent) => {
      if (!process.send) return;
      process.send(sessionEvent);
      this.lastSessionInfoEvent = sessionEvent;
    });

    iracing.on("Connected", () => {
      this.lastConnectedEvent = {
        ...this.lastConnectedEvent,
        data: true,
        timestamp: new Date(),
      };

      if (!process.send) return;
      process.send(this.lastConnectedEvent);
    });

    iracing.on("Disconnected", () => {
      this.lastConnectedEvent = {
        ...this.lastConnectedEvent,
        data: false,
        timestamp: new Date(),
      };

      if (!process.send) return;
      process.send(this.lastConnectedEvent);
    });

    process.on("message", (message) => {
      if (!process.send || typeof message !== "string") return;
      message = message.toLowerCase();
      if (message === "telemetry") {
        process.send(this.lastTelemetryEvent);
      } else if (message === "connected") {
        process.send(this.lastConnectedEvent);
      } else if (message === "sessioninfo") {
        process.send(this.lastSessionInfoEvent);
      }
    });
  }
}

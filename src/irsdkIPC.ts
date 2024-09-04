import irsdk from "node-irsdk-2023";
import { SessionInfoData, TelemetryValues } from "node-irsdk-2023/src/JsIrSdk";

interface ConnectedEvent {
  type: "Connected";
  data: boolean;
  timestamp: Date;
}

interface Telemetry {
  type: "Telemetry";
  data: TelemetryValues | null;
  timestamp: Date;
}

interface SessionInfo {
  type: "SessionInfo";
  data: SessionInfoData | null;
  timestamp: Date;
}

export class irsdkIPC {
  private sessionInfoUpdateInterval: number;
  private telemetryUpdateInterval: number;
  private lastTelemetryEvent: Telemetry = {
    type: "Telemetry",
    data: null,
    timestamp: new Date(),
  };
  private lastSessionInfoEvent: SessionInfo = {
    type: "SessionInfo",
    data: null,
    timestamp: new Date(),
  };
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

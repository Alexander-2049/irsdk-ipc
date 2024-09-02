import irsdk from "node-irsdk-2023";

export class irsdkIPC {
  private sessionInfoUpdateInterval: number;
  private telemetryUpdateInterval: number;

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
    });

    iracing.on("SessionInfo", (sessionEvent) => {
      if (!process.send) return;
      process.send(sessionEvent);
    });

    iracing.on("Connected", () => {
      if (!process.send) return;
      process.send({ connected: true });
    });

    iracing.on("Disconnected", () => {
      if (!process.send) return;
      process.send({ connected: false });
    });
  }
}

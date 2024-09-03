export declare class irsdkIPC {
    private sessionInfoUpdateInterval;
    private telemetryUpdateInterval;
    private lastTelemetryEvent;
    private lastSessionInfoEvent;
    private lastConnectedEvent;
    constructor({ sessionInfoUpdateInterval, telemetryUpdateInterval, }: {
        sessionInfoUpdateInterval: number;
        telemetryUpdateInterval: number;
    });
}

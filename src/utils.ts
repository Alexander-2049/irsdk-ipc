export const getExecutionArguments = () => {
  let TELEMETRY_UPDATE_INTERVAL = 4;
  let SESSION_INFO_UPDATE_INTERVAL = 16;

  let prevArgument: string = "";
  process.argv.forEach(function (val) {
    val = val.toLowerCase();
    if (prevArgument === "--telemetry-interval" || prevArgument === "-ti") {
      const receivedValue = new Number(val).valueOf();
      if (isNaN(receivedValue))
        throw new Error("[--telemetry-interval / -ti] value is not a number");
      if (receivedValue < 1)
        throw new Error("[--telemetry-interval / -ti] must be > 0");
      if (receivedValue > 1000) {
        console.warn(
          "NOTICE: [--telemetry-interval / -ti] value is in milliseconds"
        );
      } else TELEMETRY_UPDATE_INTERVAL = Math.floor(receivedValue);
    }
    if (prevArgument === "--session-info-interval" || prevArgument === "-si") {
      const receivedValue = new Number(val).valueOf();
      if (isNaN(receivedValue))
        throw new Error(
          "[--session-info-interval / -si] value is not a number"
        );
      if (receivedValue < 1)
        throw new Error("[--session-info-interval / -si] must be > 0");
      if (receivedValue > 1000) {
        console.warn(
          "NOTICE: [--session-info-interval / -si] value is in milliseconds"
        );
      } else SESSION_INFO_UPDATE_INTERVAL = Math.floor(receivedValue);
    }
    prevArgument = val;
  });

  return {
    TELEMETRY_UPDATE_INTERVAL,
    SESSION_INFO_UPDATE_INTERVAL,
  };
};

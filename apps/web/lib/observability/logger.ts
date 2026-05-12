type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  message: string;
  requestId?: string;
  userId?: string;
  context?: Record<string, unknown>;
}

function log(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  console[level](JSON.stringify(entry));
}

export const logger = {
  info: (payload: LogPayload) => log("info", payload),
  warn: (payload: LogPayload) => log("warn", payload),
  error: (payload: LogPayload) => log("error", payload),
};

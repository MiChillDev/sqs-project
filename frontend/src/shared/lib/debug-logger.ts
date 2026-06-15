export interface DebugLogger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

export const debugLogger: DebugLogger = {
  error(message, ...args) {
    console.error(message, ...args);
  },
  warn(message, ...args) {
    console.warn(message, ...args);
  },
  info(message, ...args) {
    console.info(message, ...args);
  },
  debug(message, ...args) {
    console.debug(message, ...args);
  },
};

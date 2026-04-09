export interface DebugLogger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

export const debugLogger: DebugLogger = {
  error(message, ...args) {
    // biome-ignore lint/suspicious/noConsole: debugLogger wraps console for controlled logging
    console.error(message, ...args);
  },
  warn(message, ...args) {
    // biome-ignore lint/suspicious/noConsole: debugLogger wraps console for controlled logging
    console.warn(message, ...args);
  },
  info(message, ...args) {
    // biome-ignore lint/suspicious/noConsole: debugLogger wraps console for controlled logging
    console.info(message, ...args);
  },
  debug(message, ...args) {
    // biome-ignore lint/suspicious/noConsole: debugLogger wraps console for controlled logging
    console.debug(message, ...args);
  },
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly body?: unknown;

  constructor(status: number, statusText: string, body?: unknown) {
    super(`HTTP ${status}${statusText ? `: ${statusText}` : ''}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export class NetworkError extends Error {
  constructor(original?: Error) {
    super(original?.message ?? 'Network request failed');
    this.name = 'NetworkError';
    this.cause = original;
  }
}

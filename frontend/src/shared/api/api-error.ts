export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly body?: unknown;

  constructor(status: number, statusText: string, body?: unknown) {
    const message = statusText ? `HTTP ${status}: ${statusText}` : `HTTP ${status}`;
    super(message);
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

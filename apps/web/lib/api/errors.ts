export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const apiErrors = {
  unauthorized: () => new HttpError(401, "UNAUTHORIZED", "Authentication required."),
  forbidden: () => new HttpError(403, "FORBIDDEN", "Insufficient permissions."),
  notFound: (message: string) => ({
    code: "NOT_FOUND" as const,
    message,
    details: [] as unknown[],
  }),
  validation: (details: unknown) =>
    new HttpError(400, "VALIDATION_ERROR", "Request validation failed.", details),
  internal: (message: string) => ({
    code: "INTERNAL_ERROR" as const,
    message,
    details: [] as unknown[],
  }),
};

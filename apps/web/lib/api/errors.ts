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
  notFound: (entity: string) => new HttpError(404, "NOT_FOUND", `${entity} was not found.`),
  validation: (details: unknown) =>
    new HttpError(400, "VALIDATION_ERROR", "Request validation failed.", details),
  internal: () => new HttpError(500, "INTERNAL_ERROR", "An unexpected error occurred."),
};

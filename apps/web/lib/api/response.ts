export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  meta: Record<string, unknown>;
}

export function ok<T>(data: T, meta: Record<string, unknown> = {}): ApiResponse<T> {
  return { data, error: null, meta };
}

export function fail(error: ApiError, meta: Record<string, unknown> = {}): ApiResponse<null> {
  return { data: null, error, meta };
}

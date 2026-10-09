export type ApiError = Error & {
	status: number;
};

export function apiError(status: number, message: string): ApiError {
	return Object.assign(new Error(message), { status });
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof Error && "status" in error;
}

export type ApiError = Error & {
	status: number;
	retryAfter?: number;
};

export function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return Object.assign(
		new Error(message),
		retryAfter === undefined ? { status } : { status, retryAfter },
	);
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof Error && "status" in error;
}

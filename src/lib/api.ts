import { apiError } from "@/lib/apiError";

const API_URL = "/api";

const REQUEST_TIMEOUT_MS = 15_000;

const REFRESH_EXCLUDED_PATHS = new Set([
	"/auth/login",
	"/auth/register",
	"/auth/refresh",
	"/auth/forgot-password",
	"/auth/reset-password",
	"/auth/resend-verification",
	"/auth/verify-email",
]);

let refreshPromise: Promise<boolean> | null = null;

function parseRetryAfter(message: string) {
	const minutes = message.match(/retry in (\d+) minutes?/i);
	const minutesValue = minutes?.[1];

	if (minutesValue) {
		return Number(minutesValue) * 60;
	}

	const seconds = message.match(/retry in (\d+) seconds?/i);
	const secondsValue = seconds?.[1];

	if (secondsValue) {
		return Number(secondsValue);
	}

	return undefined;
}

function refreshSession(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		})
			.then((response) => response.ok)
			.catch(() => false)
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
	retry = true,
): Promise<T> {
	const headers = new Headers(options.headers);

	if (options.body) {
		headers.set("Content-Type", "application/json");
	}

	const signal = options.signal
		? AbortSignal.any([options.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
		: AbortSignal.timeout(REQUEST_TIMEOUT_MS);

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: "include",
		headers,
		signal,
	});

	const pathname = path.split("?")[0];
	const shouldRefresh =
		response.status === 401 && retry && !REFRESH_EXCLUDED_PATHS.has(pathname);

	if (shouldRefresh) {
		const refreshed = await refreshSession();

		if (refreshed) {
			return apiFetch<T>(path, options, false);
		}
	}

	if (!response.ok) {
		const errorBody = (await response.json().catch(() => ({}))) as {
			message?: string;
		};
		const message = errorBody.message ?? `Request failed: ${response.status}`;
		const retryAfterHeader = response.headers.get("retry-after");
		const retryAfterFromHeader = retryAfterHeader
			? Number(retryAfterHeader)
			: Number.NaN;

		throw apiError(
			response.status,
			message,
			Number.isFinite(retryAfterFromHeader)
				? retryAfterFromHeader
				: parseRetryAfter(message),
		);
	}

	return response.json() as Promise<T>;
}

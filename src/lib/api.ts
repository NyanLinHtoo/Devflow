import { apiError } from "@/lib/apiError";

const API_URL = "/api";

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

function refreshSession(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
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

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: "include",
		headers,
	});

	const pathname = path.split("?")[0];
	const shouldRefresh =
		response.status === 401 &&
		retry &&
		!REFRESH_EXCLUDED_PATHS.has(pathname);

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

		throw apiError(
			response.status,
			errorBody.message ?? `Request failed: ${response.status}`,
		);
	}

	return response.json() as Promise<T>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
	retry = true,
): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const shouldRefresh =
		response.status === 401 &&
		retry &&
		path !== "/auth/login" &&
		path !== "/auth/refresh";

	if (shouldRefresh) {
		const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (refreshResponse.ok) {
			return apiFetch<T>(path, options, false);
		}
	}

	if (!response.ok) {
		const errorBody = (await response.json().catch(() => ({}))) as {
			message?: string;
		};

		throw new Error(errorBody.message ?? `Request failed: ${response.status}`);
	}

	return response.json() as Promise<T>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorBody = (await response.json().catch(() => ({}))) as {
			message?: string;
		};

		throw new Error(errorBody.message ?? `Request failed: ${response.status}`);
	}

	return response.json() as Promise<T>;
}

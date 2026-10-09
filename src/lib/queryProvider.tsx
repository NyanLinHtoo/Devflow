"use client";

import { isApiError } from "@/lib/apiError";
import { toaster } from "@/lib/toaster";
import {
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

type ToastMeta = {
	successMessage?: string;
	skipErrorToast?: boolean;
};

function getToastMeta(meta: unknown): ToastMeta {
	return (meta ?? {}) as ToastMeta;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				mutationCache: new MutationCache({
					onSuccess: (_data, _variables, _context, mutation) => {
						const { successMessage } = getToastMeta(mutation.meta);

						if (successMessage) {
							toaster.success({ title: successMessage });
						}
					},
					onError: (error, _variables, _context, mutation) => {
						const { skipErrorToast } = getToastMeta(mutation.meta);

						if (skipErrorToast) {
							return;
						}

						toaster.error({
							title: "Something went wrong",
							description: error instanceof Error ? error.message : undefined,
						});
					},
				}),
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						refetchOnWindowFocus: false,
						retry: (failureCount, error) => {
							if (isApiError(error) && error.status < 500) {
								return false;
							}

							return failureCount < 2;
						},
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

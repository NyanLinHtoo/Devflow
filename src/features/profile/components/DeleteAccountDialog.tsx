"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { useDeleteAccount } from "@/hooks/useProfile";
import { isApiError } from "@/lib/apiError";
import { Dialog } from "@ark-ui/react/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountDialog() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const deleteAccount = useDeleteAccount();
	const queryClient = useQueryClient();
	const router = useRouter();

	async function handleDelete() {
		setError(null);

		try {
			await deleteAccount.mutateAsync(password);
			queryClient.clear();
			router.replace("/login");
		} catch (caught) {
			setError(
				isApiError(caught)
					? caught.message
					: "Could not delete your account. Try again.",
			);
		}
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="button" variant="danger">
					Delete my account
				</Button>
			</Dialog.Trigger>

			<DialogContent title="Delete account?">
				<Dialog.Description className="mt-2 text-sm text-muted-foreground">
					This permanently deletes your account and removes you from all
					projects. This cannot be undone.
				</Dialog.Description>

				<div className="mt-4">
					<FormField
						label="Confirm your password"
						htmlFor="delete-password"
						error={error ?? undefined}>
						<PasswordInput
							id="delete-password"
							autoComplete="current-password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</FormField>
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger asChild>
						<Button
							type="button"
							variant="secondary"
							disabled={deleteAccount.isPending}>
							Cancel
						</Button>
					</Dialog.CloseTrigger>

					<Button
						type="button"
						variant="danger"
						onClick={handleDelete}
						disabled={deleteAccount.isPending || password.length === 0}>
						{deleteAccount.isPending ? "Deleting..." : "Delete account"}
					</Button>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
}

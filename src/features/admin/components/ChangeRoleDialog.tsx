"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/text-area";
import { accountRoleOptions } from "@/features/admin/roleOptions";
import { useUpdateUserRole } from "@/hooks/useAdminUsers";
import { isApiError } from "@/lib/apiError";
import { roleLabels } from "@/lib/roles";
import type { AdminUser } from "@/types/adminTypes";
import type { AccountRole } from "@/types/authTypes";
import { Dialog } from "@ark-ui/react/dialog";
import { type FormEvent, useState } from "react";

type ChangeRoleDialogProps = {
	user: AdminUser;
};

export default function ChangeRoleDialog({ user }: ChangeRoleDialogProps) {
	const [open, setOpen] = useState(false);
	const [role, setRole] = useState<AccountRole>(user.role);
	const [reason, setReason] = useState("");
	const [error, setError] = useState<string | null>(null);
	const updateRole = useUpdateUserRole();

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);

		if (nextOpen) {
			setRole(user.role);
			setReason("");
			setError(null);
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (role === user.role) {
			setOpen(false);
			return;
		}

		setError(null);

		try {
			await updateRole.mutateAsync({
				userId: user.id,
				role,
				reason: reason.trim(),
			});
			setOpen(false);
		} catch (caught) {
			setError(
				isApiError(caught)
					? caught.message
					: "Could not update the role. Try again.",
			);
		}
	}

	const reasonIsValid = reason.trim().length >= 3;
	const changed = role !== user.role;

	return (
		<Dialog.Root open={open} onOpenChange={(details) => handleOpenChange(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button" variant="secondary" size="sm">
					Change role
				</Button>
			</Dialog.Trigger>

			<DialogContent title={`Change role for ${user.fullName}`}>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<FormField label="Account role" htmlFor={`admin-role-${user.id}`}>
						<Select
							id={`admin-role-${user.id}`}
							value={role}
							onChange={(value) => setRole(value as AccountRole)}
							options={accountRoleOptions}
						/>
					</FormField>

					<FormField
						label="Reason"
						htmlFor={`admin-reason-${user.id}`}
						error={error ?? undefined}
						helperText="Stored in the admin audit log.">
						<TextArea
							id={`admin-reason-${user.id}`}
							value={reason}
							maxLength={500}
							placeholder="Why is this role changing?"
							onChange={(event) => setReason(event.target.value)}
						/>
					</FormField>

					<p className="text-xs text-muted-foreground">
						Current role: {roleLabels[user.role]}
						{role === "ADMIN"
							? " · Admins can manage users and create projects."
							: ""}
					</p>

					<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
						<Dialog.CloseTrigger asChild>
							<Button
								type="button"
								variant="secondary"
								className="w-full sm:w-auto">
								Cancel
							</Button>
						</Dialog.CloseTrigger>

						<Button
							type="submit"
							className="w-full sm:w-auto"
							disabled={updateRole.isPending || !changed || !reasonIsValid}>
							{updateRole.isPending ? "Saving..." : "Save role"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog.Root>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/hooks/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type ChangePasswordFormData, changePasswordSchema } from "../schemas";

export default function ChangePasswordForm() {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const changePassword = useChangePassword();

	function onSubmit(data: ChangePasswordFormData) {
		changePassword.mutate(
			{
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			},
			{
				onSuccess: () => {
					reset({
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
					});
				},
			},
		);
	}

	return (
		<section
			id="profile-security"
			className="scroll-mt-6 rounded-lg border border-border bg-surface p-4">
			<div className="mb-4">
				<h2 className="text-lg font-medium">Password</h2>
				<p className="text-sm text-muted-foreground">
					Use at least 8 characters. You stay signed in on this device.
				</p>
			</div>

			<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
				<FormField
					label="Current password"
					htmlFor="currentPassword"
					error={errors.currentPassword?.message}>
					<Controller
						control={control}
						name="currentPassword"
						render={({ field }) => (
							<PasswordInput
								id="currentPassword"
								name={field.name}
								autoComplete="current-password"
								maxLength={128}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
				</FormField>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						label="New password"
						htmlFor="newPassword"
						error={errors.newPassword?.message}>
						<Controller
							control={control}
							name="newPassword"
							render={({ field }) => (
								<PasswordInput
									id="newPassword"
									name={field.name}
									autoComplete="new-password"
									maxLength={128}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
					</FormField>

					<FormField
						label="Confirm new password"
						htmlFor="confirmPassword"
						error={errors.confirmPassword?.message}>
						<Controller
							control={control}
							name="confirmPassword"
							render={({ field }) => (
								<PasswordInput
									id="confirmPassword"
									name={field.name}
									autoComplete="new-password"
									maxLength={128}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
					</FormField>
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={changePassword.isPending}>
						{changePassword.isPending ? "Updating..." : "Update password"}
					</Button>
				</div>
			</form>
		</section>
	);
}

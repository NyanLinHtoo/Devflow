"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetPassword } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
	ResetPasswordFormData,
	resetPasswordSchema,
} from "../schemas/resetPasswordSchema";

export default function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const router = useRouter();
	const resetPasswordMutation = useResetPassword();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	});

	function onSubmit(data: ResetPasswordFormData) {
		resetPasswordMutation.mutate(
			{ token, password: data.password },
			{
				onSuccess: () => {
					router.push("/login");
				},
			},
		);
	}

	if (!token) {
		return (
			<p className="text-center text-sm text-danger">
				This reset link is missing its token. Request a new one.
			</p>
		);
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			<FormField
				label="New password"
				htmlFor="password"
				error={errors.password?.message}>
				<PasswordInput
					id="password"
					placeholder="Enter your new password"
					autoComplete="new-password"
					{...register("password")}
				/>
			</FormField>

			<FormField
				label="Confirm password"
				htmlFor="confirmPassword"
				error={errors.confirmPassword?.message}>
				<PasswordInput
					id="confirmPassword"
					placeholder="Confirm your new password"
					autoComplete="new-password"
					{...register("confirmPassword")}
				/>
			</FormField>

			<Button
				type="submit"
				className="w-full"
				disabled={resetPasswordMutation.isPending}>
				{resetPasswordMutation.isPending ? "Updating..." : "Update password"}
			</Button>
		</form>
	);
}

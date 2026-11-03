"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/useAuth";
import { useCooldown } from "@/hooks/useCooldown";
import { isApiError } from "@/lib/apiError";
import { formatCountdown } from "@/lib/countdown";
import { deferToast, toaster } from "@/lib/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordFormData, forgotPasswordSchema } from "../schemas";

const RESEND_COOLDOWN_SECONDS = 300;

export default function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const forgotPasswordMutation = useForgotPassword();
	const cooldown = useCooldown();
	const [formError, setFormError] = useState<string | null>(null);

	function onSubmit(data: ForgotPasswordFormData) {
		setFormError(null);

		forgotPasswordMutation.mutate(data, {
			onSuccess: () => {
				cooldown.start(RESEND_COOLDOWN_SECONDS);

				deferToast(() =>
					toaster.create({
						type: "info",
						title: `You can request another email in 5 minutes`,
					}),
				);
			},
			onError: (error) => {
				if (isApiError(error) && error.status === 429) {
					const seconds = error.retryAfter ?? 60;
					cooldown.start(seconds);

					deferToast(() =>
						toaster.create({
							type: "warning",
							title: `You can request another email in ${formatCountdown(seconds)}`,
						}),
					);
					return;
				}

				setFormError(
					error instanceof Error ? error.message : "Unable to send the email.",
				);
			},
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			{forgotPasswordMutation.isSuccess ? (
				<div className="rounded-md border border-success/30 bg-success-surface p-3 text-sm text-success">
					If an account exists for that email, a reset link is on its way. Check
					your inbox and spam — it can take a minute.
				</div>
			) : null}

			<FormField label="Email" htmlFor="email" error={errors.email?.message}>
				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					maxLength={254}
					{...register("email")}
				/>
			</FormField>

			{formError ? (
				<p role="alert" className="text-sm text-danger">
					{formError}
				</p>
			) : null}

			<Button
				type="submit"
				className="w-full"
				disabled={forgotPasswordMutation.isPending || cooldown.isActive}>
				{cooldown.isActive
					? `Resend in ${formatCountdown(cooldown.remaining)}`
					: forgotPasswordMutation.isPending
						? "Sending..."
						: "Send reset email"}
			</Button>
		</form>
	);
}

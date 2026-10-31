"use client";

import { Button } from "@/components/ui/button";
import { CooldownNotice } from "@/components/ui/cooldown";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/hooks/useAuth";
import { useCooldown } from "@/hooks/useCooldown";
import { isApiError } from "@/lib/apiError";
import { formatCountdown } from "@/lib/countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../schemas";

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const router = useRouter();
	const loginMutation = useLogin();
	const cooldown = useCooldown();
	const [formError, setFormError] = useState<string | null>(null);

	function onSubmit(data: LoginFormData) {
		setFormError(null);

		loginMutation.mutate(data, {
			onSuccess: () => {
				router.push("/dashboard");
			},
			onError: (error) => {
				if (isApiError(error) && error.status === 429) {
					cooldown.start(error.retryAfter ?? 60);
					return;
				}

				setFormError(
					error instanceof Error ? error.message : "Unable to sign in.",
				);
			},
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			<FormField label="Email" htmlFor="email" error={errors.email?.message}>
				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					{...register("email")}
				/>
			</FormField>

			<FormField
				label="Password"
				htmlFor="password"
				error={errors.password?.message}>
				<PasswordInput
					id="password"
					placeholder="Enter your password"
					autoComplete="current-password"
					{...register("password")}
				/>
			</FormField>

			<div className="flex justify-end">
				<Link
					href="/forgot-password"
					className="text-sm font-medium text-foreground hover:underline">
					Forgot password?
				</Link>
			</div>

			{formError ? (
				<p role="alert" className="text-sm text-danger">
					{formError}
				</p>
			) : null}

			<CooldownNotice
				remaining={cooldown.remaining}
				message="Too many attempts. Try again in"
			/>

			<Button
				type="submit"
				className="w-full"
				disabled={loginMutation.isPending || cooldown.isActive}>
				{cooldown.isActive
					? `Try again in ${formatCountdown(cooldown.remaining)}`
					: loginMutation.isPending
						? "Signing in..."
						: "Sign in"}
			</Button>
		</form>
	);
}

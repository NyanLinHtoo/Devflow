"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input/passwordInput";
import { useRegister, useResendVerification } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "../schemas/registerSchema";

export default function RegisterForm() {
	const [registered, setRegistered] = useState<{
		email: string;
		verificationToken?: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			acceptedTerms: false,
		},
	});

	const registerMutation = useRegister();
	const resendMutation = useResendVerification();

	function onSubmit(data: RegisterFormData) {
		registerMutation.mutate(data, {
			onSuccess: (response) => {
				setRegistered({
					email: data.email,
					verificationToken: response.emailVerification?.token,
				});
			},
		});
	}

	if (registered) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm text-gray-600">
					We sent a verification link to{" "}
					<span className="font-medium text-gray-900">{registered.email}</span>.
					Verify your email before signing in.
				</p>

				{registered.verificationToken && (
					<p className="text-sm">
						<Link
							href={`/verify-email?token=${registered.verificationToken}`}
							className="font-medium text-gray-900 hover:underline">
							Verify now (development)
						</Link>
					</p>
				)}

				<Button
					type="button"
					className="w-full"
					onClick={() => resendMutation.mutate({ email: registered.email })}
					disabled={resendMutation.isPending}>
					{resendMutation.isPending
						? "Sending..."
						: resendMutation.isSuccess
							? "Verification email sent"
							: "Resend verification email"}
				</Button>

				{resendMutation.error instanceof Error && (
					<p className="text-sm text-red-600">
						{resendMutation.error.message}
					</p>
				)}

				<Link
					href="/login"
					className="text-sm font-medium text-gray-900 hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			{registerMutation.error instanceof Error && (
				<p className="text-sm text-red-600">{registerMutation.error.message}</p>
			)}
			<FormField
				label="Full name"
				htmlFor="fullName"
				error={errors.fullName?.message}>
				<Input
					id="fullName"
					type="text"
					placeholder="Enter your name"
					autoComplete="name"
					{...register("fullName")}
				/>
			</FormField>

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
					placeholder="Confirm your password"
					autoComplete="new-password"
					{...register("confirmPassword")}
				/>
			</FormField>

			<label className="flex items-center gap-2 text-sm text-gray-600">
				<input
					type="checkbox"
					className="size-4 rounded border-gray-300"
					{...register("acceptedTerms")}
				/>
				<span>
					I agree to the{" "}
					<Link
						href="/terms"
						className="font-medium text-gray-900 hover:underline">
						Terms
					</Link>
					and{" "}
					<Link
						href="/privacy"
						className="font-medium text-gray-900 hover:underline">
						Privacy Policy
					</Link>
				</span>
			</label>

			{errors.acceptedTerms?.message && (
				<p className="text-sm text-red-600">{errors.acceptedTerms.message}</p>
			)}

			<Button
				type="submit"
				className="w-full"
				disabled={registerMutation.isPending}>
				{registerMutation.isPending ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}

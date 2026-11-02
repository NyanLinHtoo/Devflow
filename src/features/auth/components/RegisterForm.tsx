"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister, useResendVerification } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "../schemas";

export default function RegisterForm() {
	const [registered, setRegistered] = useState<{
		email: string;
		verificationToken?: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		control,
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
				<p className="text-sm text-muted-foreground">
					We sent a verification link to{" "}
					<span className="font-medium text-foreground">
						{registered.email}
					</span>
					. Verify your email before signing in.
				</p>

				{process.env.NODE_ENV !== "production" &&
					registered.verificationToken && (
					<p className="text-sm">
						<Link
							href={`/verify-email?token=${registered.verificationToken}`}
							className="font-medium text-foreground hover:underline">
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

				<Link
					href="/login"
					className="text-sm font-medium text-foreground hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

			<Controller
				control={control}
				name="acceptedTerms"
				render={({ field }) => (
					<Checkbox
						id="acceptedTerms"
						checked={field.value}
						onCheckedChange={field.onChange}
						disabled={registerMutation.isPending}>
						I agree to the{" "}
						<Link
							href="/terms"
							onClick={(event) => event.stopPropagation()}
							className="font-medium text-foreground hover:underline">
							Terms
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							onClick={(event) => event.stopPropagation()}
							className="font-medium text-foreground hover:underline">
							Privacy Policy
						</Link>
					</Checkbox>
				)}
			/>

			{errors.acceptedTerms?.message && (
				<p className="text-sm text-danger">{errors.acceptedTerms.message}</p>
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

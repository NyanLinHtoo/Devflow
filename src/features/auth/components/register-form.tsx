"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RegisterFormData, registerSchema } from "../schemas/register-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			acceptedTerms: false,
		},
	});
	const [serverError, setServerError] = useState<string | null>(null);
	const router = useRouter();

	async function onSubmit(data: RegisterFormData) {
		try {
			setServerError(null);

			await apiFetch("/auth/register", {
				method: "POST",
				body: JSON.stringify({
					fullName: data.fullName,
					email: data.email,
					password: data.password,
					acceptedTerms: data.acceptedTerms,
				}),
			});
			router.push("/login");
		} catch (error) {
			if (error instanceof Error) {
				setServerError(error.message);
			} else {
				setServerError("Something went wrong");
			}
		}
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			{serverError && <p className="text-sm text-red-600">{serverError}</p>}
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
				<Input
					id="password"
					type="password"
					placeholder="Enter your password"
					autoComplete="new-password"
					{...register("password")}
				/>
			</FormField>

			<FormField
				label="Confirm password"
				htmlFor="confirmPassword"
				error={errors.confirmPassword?.message}>
				<Input
					id="confirmPassword"
					type="password"
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
						Terms{" "}
					</Link>
					and{" "}
					<Link
						href="/privacy"
						className="font-medium text-gray-900 hover:underline">
						Privacy Policy{" "}
					</Link>
				</span>
			</label>

			{errors.acceptedTerms?.message && (
				<p className="text-sm text-red-600">{errors.acceptedTerms.message}</p>
			)}

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}

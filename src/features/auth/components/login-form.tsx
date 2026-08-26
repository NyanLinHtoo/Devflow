"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginFormData, loginSchema } from "../schemas/login-schema";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const [serverError, setServerError] = useState<string | null>(null);
	const router = useRouter();

	async function onSubmit(data: LoginFormData) {
		try {
			setServerError(null);

			await apiFetch("/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});

			router.push("/dashboard");
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
					autoComplete="current-password"
					{...register("password")}
				/>
			</FormField>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 text-sm text-gray-600">
					<input
						type="checkbox"
						name="remember"
						className="size-4 rounded border-gray-300"
					/>
					Remember me
				</label>

				<Link
					href="/forgot-password"
					className="text-sm font-medium text-gray-900 hover:underline">
					Forgot password?
				</Link>
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}

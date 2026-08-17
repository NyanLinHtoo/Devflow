"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginFormData, loginSchema } from "../schemas/login-schema";
import { useForm } from "react-hook-form";

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	function onSubmit(data: LoginFormData) {
		console.log(data);
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

			<Button type="submit" className="w-full">
				Sign in
			</Button>
		</form>
	);
}

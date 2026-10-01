"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../schemas/loginSchema";
import { useLogin } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/ui/input/passwordInput";

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

	function onSubmit(data: LoginFormData) {
		loginMutation.mutate(data, {
			onSuccess: () => {
				router.push("/dashboard");
			},
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
			{loginMutation.error instanceof Error && (
				<p className="text-sm text-red-600">{loginMutation.error.message}</p>
			)}
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
					className="text-sm font-medium text-gray-900 hover:underline">
					Forgot password?
				</Link>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={loginMutation.isPending}>
				{loginMutation.isPending ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}

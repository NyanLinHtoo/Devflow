"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "../schemas/registerSchema";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterForm() {
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

	const router = useRouter();
	const registerMutation = useRegister();

	function onSubmit(data: RegisterFormData) {
		registerMutation.mutate(data, {
			onSuccess: () => {
				router.push("/login");
			},
		});
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

			<Button
				type="submit"
				className="w-full"
				disabled={registerMutation.isPending}>
				{registerMutation.isPending ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}

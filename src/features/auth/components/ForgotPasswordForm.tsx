"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	ForgotPasswordFormData,
	forgotPasswordSchema,
} from "../schemas/forgotPasswordSchema";

export default function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const forgotPasswordMutation = useForgotPassword();

	function onSubmit(data: ForgotPasswordFormData) {
		forgotPasswordMutation.mutate(data);
	}

	if (forgotPasswordMutation.isSuccess) {
		return (
			<p className="text-center text-sm text-muted-foreground">
				If the account exists, a reset email will be sent.
			</p>
		);
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

			<Button
				type="submit"
				className="w-full"
				disabled={forgotPasswordMutation.isPending}>
				{forgotPasswordMutation.isPending ? "Sending..." : "Send reset email"}
			</Button>
		</form>
	);
}

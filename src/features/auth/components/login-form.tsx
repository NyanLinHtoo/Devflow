import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm() {
	return (
		<form className="space-y-5">
			<FormField label="Email" htmlFor="email">
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
				/>
			</FormField>

			<FormField label="Password" htmlFor="password">
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Enter your password"
					autoComplete="current-password"
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

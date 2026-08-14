import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function RegisterForm() {
	return (
		<form className="space-y-5">
			<FormField label="Full name" htmlFor="fullname">
				<Input
					id="fullname"
					name="fullname"
					type="text"
					placeholder="Enter your name"
					autoComplete="name"
				/>
			</FormField>

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
					autoComplete="new-password"
				/>
			</FormField>

			<FormField label="Confirm password" htmlFor="confirmPassword">
				<Input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="Confirm your password"
					autoComplete="new-password"
				/>
			</FormField>

			<label className="flex items-center gap-2 text-sm text-gray-600">
				<input
					type="checkbox"
					name="terms"
					className="size-4 rounded border-gray-300"
				/>
				I agree to the
				<Link href="/#" className="font-medium text-gray-900 hover:underline">
					Terms
				</Link>
				and
				<Link href="/#" className="font-medium text-gray-900 hover:underline">
					Privacy Policy
				</Link>
			</label>

			<Button type="submit" className="w-full">
				Create account
			</Button>
		</form>
	);
}

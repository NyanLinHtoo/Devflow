"use client";

import { useVerifyEmail } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailStatus() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const { isLoading, isError, error } = useVerifyEmail(token);

	if (!token) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm text-red-600">
					This verification link is missing its token.
				</p>
				<Link
					href="/login"
					className="text-sm font-medium text-gray-900 hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	if (isLoading) {
		return (
			<p className="text-center text-sm text-gray-600">
				Verifying your email...
			</p>
		);
	}

	if (isError) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm text-red-600">
					{error instanceof Error
						? error.message
						: "Could not verify this link."}
				</p>
				<Link
					href="/login"
					className="text-sm font-medium text-gray-900 hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4 text-center">
			<p className="text-sm text-gray-600">
				Your email has been verified. You can now sign in.
			</p>
			<Link
				href="/login"
				className="text-sm font-medium text-gray-900 hover:underline">
				Sign in
			</Link>
		</div>
	);
}

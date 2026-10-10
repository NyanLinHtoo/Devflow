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
				<p className="text-sm text-danger">
					This verification link is missing its token.
				</p>
				<Link
					href="/login"
					className="text-sm font-medium text-foreground hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	if (isLoading) {
		return (
			<p className="text-center text-sm text-muted-foreground">
				Verifying your email...
			</p>
		);
	}

	if (isError) {
		return (
			<div className="space-y-4 text-center">
				<p className="text-sm text-danger">
					{error instanceof Error
						? error.message
						: "Could not verify this link."}
				</p>
				<Link
					href="/login"
					className="text-sm font-medium text-foreground hover:underline">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4 text-center">
			<p className="text-sm text-muted-foreground">
				Your email has been verified. You can now sign in.
			</p>
			<Link
				href="/login"
				className="text-sm font-medium text-foreground hover:underline">
				Sign in
			</Link>
		</div>
	);
}

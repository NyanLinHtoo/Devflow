"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CurrentUser = {
	userId: string;
	email: string;
};

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			try {
				const currentUser = await apiFetch<CurrentUser>("/auth/me");

				setUser(currentUser);
			} catch {
				router.replace("/login");
			} finally {
				setIsLoading(false);
			}
		}

		void checkAuth();
	}, [router]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return null;
	}

	return (
		<main>
			<h1>Dashboard</h1>
			<p>{user.email}</p>
		</main>
	);
}

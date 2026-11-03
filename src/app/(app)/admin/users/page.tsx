"use client";

import { AdminUsersSkeleton } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/state";
import AdminUserTable from "@/features/admin/components/AdminUserTable";
import { accountRoleFilterOptions } from "@/features/admin/roleOptions";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { AccountRole } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
	const router = useRouter();
	const { data: user, isLoading: isAuthLoading } = useRequireAuth();
	const [query, setQuery] = useState("");
	const [role, setRole] = useState<AccountRole | "ALL">("ALL");
	const [page, setPage] = useState(1);
	const debouncedQuery = useDebouncedValue(query, 300);

	const { data, isLoading, isError } = useAdminUsers(
		{
			query: debouncedQuery,
			role,
			page,
		},
		user?.role === "ADMIN",
	);

	useEffect(() => {
		if (user && user.role !== "ADMIN") {
			router.replace("/dashboard");
		}
	}, [user, router]);

	if (isAuthLoading || !user) {
		return (
			<Container>
				<AdminUsersSkeleton />
			</Container>
		);
	}

	if (user.role !== "ADMIN") {
		return (
			<Container>
				<ErrorState message="You don't have access to admin tools." />
			</Container>
		);
	}

	if (isLoading && !data) {
		return (
			<Container>
				<AdminUsersSkeleton />
			</Container>
		);
	}

	const total = data?.total ?? 0;
	const pageSize = data?.pageSize ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<Container>
			<PageHeader
				title="Users"
				description={`${total} accounts · only admins can see this page`}
			/>

			<div className="mb-4 flex flex-wrap items-end gap-3">
				<div className="w-full max-w-xs">
					<FormField label="Search" htmlFor="admin-search">
						<Input
							id="admin-search"
							type="search"
							placeholder="Search name or email..."
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
						/>
					</FormField>
				</div>

				<div className="w-full max-w-48">
					<FormField label="Role" htmlFor="admin-role-filter">
						<Select
							id="admin-role-filter"
							value={role}
							onChange={(value) => {
								setRole(value as AccountRole | "ALL");
								setPage(1);
							}}
							options={accountRoleFilterOptions}
						/>
					</FormField>
				</div>
			</div>

			{isError ? (
				<ErrorState message="Failed to load users." />
			) : !data || data.users.length === 0 ? (
				<EmptyState>No users match your filters.</EmptyState>
			) : (
				<>
					<AdminUserTable users={data.users} />

					<div className="mt-4 flex items-center justify-between gap-3">
						<p className="text-sm text-muted-foreground">
							Page {page} of {totalPages}
						</p>

						<div className="flex gap-2">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={() => setPage((current) => Math.max(1, current - 1))}
								disabled={page <= 1}>
								Previous
							</Button>

							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={() =>
									setPage((current) => Math.min(totalPages, current + 1))
								}
								disabled={page >= totalPages}>
								Next
							</Button>
						</div>
					</div>
				</>
			)}
		</Container>
	);
}

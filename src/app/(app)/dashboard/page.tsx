"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roleLabels } from "@/lib/roles";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
	const router = useRouter();
	const {
		data: user,
		isLoading: isUserLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const {
		data: projects,
		isLoading: isProjectsLoading,
		isError: isProjectsError,
	} = useProjects();

	if (isUserLoading) {
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError || !user) {
		return null;
	}

	const recentProjects = (projects ?? []).slice(0, 4);

	return (
		<Container>
			<PageHeader
				title={`Welcome back, ${user.fullName}`}
				description={user.email}
				actions={
					<Button variant="secondary" onClick={() => router.push("/projects")}>
						View projects
					</Button>
				}
			/>

			<div className="mb-8 grid gap-4 sm:grid-cols-2">
				<Card>
					<p className="text-sm text-muted-foreground">Projects</p>
					<p className="mt-1 text-2xl font-semibold">
						{isProjectsLoading ? "..." : (projects?.length ?? 0)}
					</p>
				</Card>

				<Card>
					<p className="text-sm text-muted-foreground">Account role</p>
					<p className="mt-1 text-2xl font-semibold">{roleLabels[user.role]}</p>
				</Card>
			</div>

			<h2 className="mb-4 text-lg font-medium">Recent projects</h2>

			{isProjectsLoading ? (
				<LoadingState label="Loading projects..." />
			) : isProjectsError ? (
				<ErrorState message="Failed to load projects." />
			) : recentProjects.length === 0 ? (
				<EmptyState>
					No projects yet. Go to Projects to create or open one.
				</EmptyState>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{recentProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}
		</Container>
	);
}

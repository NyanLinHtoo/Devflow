"use client";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProjectsPage() {
	const {
		data: user,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const { data: projects, isLoading, isError } = useProjects();

	if (isAuthLoading) {
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError || !user) {
		return null;
	}

	const canCreate = user.role === "MANAGER";

	if (isLoading) {
		return (
			<Container>
				<LoadingState label="Loading projects..." />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container>
				<ErrorState message="Failed to load projects." />
			</Container>
		);
	}

	return (
		<Container>
			<PageHeader
				title="Projects"
				description={
					canCreate
						? undefined
						: "Only managers can create projects. Ask a manager to add you."
				}
				actions={canCreate ? <CreateProjectDialog /> : undefined}
			/>

			{projects && projects.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			) : (
				<EmptyState>
					{canCreate
						? "No projects yet. Create your first project to get started."
						: "You are not a member of any project yet."}
				</EmptyState>
			)}
		</Container>
	);
}

"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProjectsPage() {
	const { isLoading: isAuthLoading, isError: isAuthError } = useRequireAuth();
	const { data: projects, isLoading, isError } = useProjects();

	if (isAuthLoading) {
		return <LoadingState />;
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return <LoadingState label="Loading projects..." />;
	}

	if (isError) {
		return <ErrorState message="Failed to load projects." />;
	}

	if (!projects || projects.length === 0) {
		return (
			<div>
				<EmptyState>No projects yet.</EmptyState>
				<CreateProjectDialog />
			</div>
		);
	}

	return (
		<main>
			<h1>Projects</h1>
			<CreateProjectDialog />

			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</main>
	);
}

"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const container = "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6";

export default function ProjectsPage() {
	const { isLoading: isAuthLoading, isError: isAuthError } = useRequireAuth();
	const { data: projects, isLoading, isError } = useProjects();

	if (isAuthLoading) {
		return (
			<main className={container}>
				<LoadingState />
			</main>
		);
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return (
			<main className={container}>
				<LoadingState label="Loading projects..." />
			</main>
		);
	}

	if (isError) {
		return (
			<main className={container}>
				<ErrorState message="Failed to load projects." />
			</main>
		);
	}

	if (!projects || projects.length === 0) {
		return (
			<main className={`${container} flex flex-col items-start gap-4`}>
				<h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
				<EmptyState>
					No projects yet. Create your first project to get started.
				</EmptyState>
				<CreateProjectDialog />
			</main>
		);
	}

	return (
		<main className={container}>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
				<CreateProjectDialog />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</main>
	);
}

"use client";

import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProjectsPage() {
	const { isLoading: isAuthLoading, isError: isAuthError } = useRequireAuth();
	const { data: projects, isLoading, isError } = useProjects();

	if (isAuthLoading) {
		return <p>Loading...</p>;
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return <p>Loading projects...</p>;
	}

	if (isError) {
		return <p>Failed to load projects.</p>;
	}

	if (!projects || projects.length === 0) {
		return (
			<div>
				<p>No projects yet.</p>
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

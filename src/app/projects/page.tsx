"use client";

import { ProjectCard } from "@/features/projects/components/projectCard";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
	const { data: projects, isLoading, isError } = useProjects();

	if (isLoading) {
		return <p>Loading projects...</p>;
	}

	if (isError) {
		return <p>Failed to load projects.</p>;
	}

	if (!projects || projects.length === 0) {
		return <p>No projects yet.</p>;
	}

	return (
		<main>
			<h1>Projects</h1>

			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</main>
	);
}

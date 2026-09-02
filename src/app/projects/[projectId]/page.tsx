"use client";

import DeleteProjectDialog from "@/features/projects/components/deleteProjectDialog";
import { EditProjectForm } from "@/features/projects/components/editProjectForm";
import { useProject } from "@/hooks/useProjects";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const { data: project, isLoading, isError } = useProject(projectId);

	if (isLoading) {
		return <p>Loading project...</p>;
	}

	if (isError) {
		return <p>Failed to load project.</p>;
	}

	if (!project) {
		return <p>Project not found.</p>;
	}

	return (
		<main>
			<h1>Project Detail</h1>

			<p>Name: {project.name}</p>
			<p>Description: {project.description}</p>
			<p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>

			<EditProjectForm project={project} />

			<DeleteProjectDialog projectId={project.id} projectName={project.name} />
		</main>
	);
}

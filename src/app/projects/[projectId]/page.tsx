"use client";

import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TaskCard from "@/features/tasks/components/TaskCard";
import { useProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const { data: project, isLoading, isError } = useProject(projectId);
	const {
		data: tasks,
		isLoading: isTaskLoading,
		isError: isTaskError,
	} = useTasks(projectId);

	if (isLoading) {
		return <p>Loading project...</p>;
	}

	if (isError) {
		return <p>Failed to load project.</p>;
	}

	if (!project) {
		return <p>Project not found.</p>;
	}

	if (isTaskLoading) {
		return <p>Loading tasks...</p>;
	}

	if (isTaskError) {
		return <p>Failed to load task.</p>;
	}

	return (
		<main>
			<h1>Project Detail</h1>

			<p>Name: {project.name}</p>
			<p>Description: {project.description}</p>
			<p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>

			<EditProjectDialog project={project} />

			<DeleteProjectDialog projectId={projectId} projectName={project.name} />

			<CreateTaskDialog projectId={projectId} />
			{tasks && tasks.length > 0 ? (
				tasks.map((task) => (
					<TaskCard key={task.id} task={task} projectId={projectId} />
				))
			) : (
				<p>No tasks yet.</p>
			)}
		</main>
	);
}

"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TaskCard from "@/features/tasks/components/TaskCard";
import { useProject } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const { isLoading: isAuthLoading, isError: isAuthError } = useRequireAuth();
	const { data: project, isLoading, isError } = useProject(projectId);
	const {
		data: tasks,
		isLoading: isTaskLoading,
		isError: isTaskError,
	} = useTasks(projectId);

	if (isAuthLoading) {
		return <LoadingState />;
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return <LoadingState label="Loading project..." />;
	}

	if (isError) {
		return <ErrorState message="Failed to load project." />;
	}

	if (!project) {
		return <ErrorState message="Project not found." />;
	}

	if (isTaskLoading) {
		return <LoadingState label="Loading tasks..." />;
	}

	if (isTaskError) {
		return <ErrorState message="Failed to load tasks." />;
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
				<EmptyState>No tasks yet.</EmptyState>
			)}
		</main>
	);
}

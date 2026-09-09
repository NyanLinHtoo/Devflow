"use client";

import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import DeleteTaskDialog from "@/features/tasks/components/DeleteTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
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

			<CreateProjectDialog />
			<EditProjectDialog project={project} />

			<DeleteProjectDialog projectId={projectId} projectName={project.name} />

			{tasks && tasks.length > 0 ? (
				tasks.map((task) => (
					<div key={task.id}>
						<TaskCard task={task} />
						<EditTaskDialog projectId={projectId} task={task} />
						<DeleteTaskDialog
							taskId={task.id}
							projectId={projectId}
							taskTitle={task.title}
						/>
					</div>
				))
			) : (
				<p>No tasks yet.</p>
			)}

			<CreateTaskDialog projectId={projectId} />
		</main>
	);
}

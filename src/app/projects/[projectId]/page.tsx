"use client";

import DeleteProjectDialog from "@/features/projects/components/deleteProjectDialog";
import { EditProjectForm } from "@/features/projects/components/editProjectForm";
import { CreateTaskForm } from "@/features/tasks/components/createTaskForm";
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

			<EditProjectForm project={project} />

			<DeleteProjectDialog projectId={project.id} projectName={project.name} />

			{tasks && tasks.length > 0 ? (
				tasks.map((task) => (
					<div key={task.id}>
						<h3>Task : {task.title}</h3>
						<p>Status : {task.status}</p>
						<p>Priority : {task.priority}</p>
						<p>
							Due Date :{" "}
							{task.dueDate === null
								? "No Due Date"
								: new Date(task.dueDate).toDateString()}
						</p>
					</div>
				))
			) : (
				<p>No tasks yet.</p>
			)}

			<CreateTaskForm projectId={project.id} />
		</main>
	);
}

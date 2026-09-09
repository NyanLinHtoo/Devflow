"use client";

import DeleteTaskDialog from "@/features/tasks/components/DeleteTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import { useTask } from "@/hooks/useTasks";
import { useParams } from "next/navigation";

export default function TaskDetail() {
	const params = useParams<{ projectId: string; taskId: string }>();
	const projectId = params.projectId;
	const taskId = params.taskId;

	const { data: task, isLoading, isError } = useTask(projectId, taskId);

	if (isLoading) {
		return <p>Loading task...</p>;
	}

	if (isError) {
		return <p>Failed to load task.</p>;
	}

	if (!task) {
		return <p>Task not found.</p>;
	}

	return (
		<main>
			<h1>Task Detail</h1>
			<p>Title : {task.title}</p>
			<p>
				Description : {task.description ? task.description : "No description"}
			</p>
			<p>Status : {task.status}</p>
			<p>Priority : {task.priority}</p>
			<p>
				Due Date :{" "}
				{task.dueDate === null
					? "No Due Date"
					: new Date(task.dueDate).toDateString()}
			</p>
			<p>Created Date : {new Date(task.createdAt).toDateString()}</p>
			<p>Updated Date : {new Date(task.updatedAt).toDateString()}</p>

			<EditTaskDialog projectId={projectId} task={task} />
			<DeleteTaskDialog
				taskId={task.id}
				projectId={projectId}
				taskTitle={task.title}
				redirectAfterDelete
			/>
		</main>
	);
}

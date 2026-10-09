"use client";

import { ErrorState, LoadingState } from "@/components/ui/state";
import TaskAssigneeSelect from "@/features/projects/components/TaskAssigneeSelect";
import DeleteTaskDialog from "@/features/tasks/components/DeleteTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import {
	taskPriorityLabels,
	taskStatusLabels,
} from "@/features/tasks/taskLabels";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTask } from "@/hooks/useTasks";
import { useParams } from "next/navigation";

export default function TaskDetail() {
	const params = useParams<{ projectId: string; taskId: string }>();
	const projectId = params.projectId;
	const taskId = params.taskId;

	const {
		data: currentUser,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const { data: task, isLoading, isError } = useTask(projectId, taskId);
	const { data: members = [] } = useProjectMembers(projectId);

	const currentMember = members.find(
		(member) => member.userId === currentUser?.id,
	);

	const canAssign = currentMember?.role === "MANAGER";

	if (isAuthLoading) {
		return <LoadingState />;
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return <LoadingState label="Loading task..." />;
	}

	if (isError) {
		return <ErrorState message="Failed to load task." />;
	}

	if (!task) {
		return <ErrorState message="Task not found." />;
	}

	return (
		<main>
			<h1>Task Detail</h1>
			<p>Title : {task.title}</p>
			<p>
				Description : {task.description ? task.description : "No description"}
			</p>
			<p>Status : {taskStatusLabels[task.status]}</p>
			<p>Priority : {taskPriorityLabels[task.priority]}</p>
			<p>
				Due Date :{" "}
				{task.dueDate === null
					? "No Due Date"
					: new Date(task.dueDate).toDateString()}
			</p>
			<p>Created Date : {new Date(task.createdAt).toDateString()}</p>
			<p>Updated Date : {new Date(task.updatedAt).toDateString()}</p>

			<TaskAssigneeSelect
				projectId={projectId}
				taskId={task.id}
				assignedMember={task.assignedMember}
				members={members}
				canAssign={canAssign}
			/>

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

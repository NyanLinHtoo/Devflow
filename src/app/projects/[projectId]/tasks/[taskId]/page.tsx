"use client";

import { ErrorState, LoadingState } from "@/components/ui/state";
import TaskAssigneeSelect from "@/features/tasks/components/TaskAssigneeSelect";
import DeleteTaskDialog from "@/features/tasks/components/DeleteTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import {
	taskPriorityLabels,
	taskStatusLabels,
} from "@/features/tasks/taskLabels";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTask } from "@/hooks/useTasks";
import Link from "next/link";
import { useParams } from "next/navigation";

const container = "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6";

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
				<LoadingState label="Loading task..." />
			</main>
		);
	}

	if (isError) {
		return (
			<main className={container}>
				<ErrorState message="Failed to load task." />
			</main>
		);
	}

	if (!task) {
		return (
			<main className={container}>
				<ErrorState message="Task not found." />
			</main>
		);
	}

	return (
		<main className={container}>
			<Link
				href={`/projects/${projectId}`}
				className="text-sm text-muted-foreground hover:text-foreground">
				← Back to project
			</Link>

			<div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{task.title}
					</h1>
					<p className="mt-1 text-xs text-muted-foreground">
						Updated {new Date(task.updatedAt).toLocaleDateString()}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<EditTaskDialog projectId={projectId} task={task} />
					<DeleteTaskDialog
						taskId={task.id}
						projectId={projectId}
						taskTitle={task.title}
						redirectAfterDelete
					/>
				</div>
			</div>

			<dl className="grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2">
				<div>
					<dt className="text-xs font-medium text-muted-foreground">Status</dt>
					<dd className="mt-1 text-sm">{taskStatusLabels[task.status]}</dd>
				</div>

				<div>
					<dt className="text-xs font-medium text-muted-foreground">
						Priority
					</dt>
					<dd className="mt-1 text-sm">{taskPriorityLabels[task.priority]}</dd>
				</div>

				<div>
					<dt className="text-xs font-medium text-muted-foreground">
						Due date
					</dt>
					<dd className="mt-1 text-sm">
						{task.dueDate === null
							? "No due date"
							: new Date(task.dueDate).toDateString()}
					</dd>
				</div>

				<div>
					<dt className="text-xs font-medium text-muted-foreground">Created</dt>
					<dd className="mt-1 text-sm">
						{new Date(task.createdAt).toLocaleDateString()}
					</dd>
				</div>

				<div className="sm:col-span-2">
					<dt className="text-xs font-medium text-muted-foreground">
						Description
					</dt>
					<dd className="mt-1 text-sm">
						{task.description || "No description"}
					</dd>
				</div>
			</dl>

			<div className="mt-6 rounded-lg border border-border bg-surface p-4">
				<TaskAssigneeSelect
					projectId={projectId}
					taskId={task.id}
					assignedMember={task.assignedMember}
					members={members}
					canAssign={canAssign}
				/>
			</div>
		</main>
	);
}

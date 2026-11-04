"use client";

import { TaskDetailSkeleton } from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState } from "@/components/ui/state";
import DeleteTaskDialog from "@/features/tasks/components/DeleteTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import TaskAssigneeSelect from "@/features/tasks/components/TaskAssigneeSelect";
import {
	taskPriorityLabels,
	taskStatusLabels,
} from "@/features/tasks/taskLabels";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTask } from "@/hooks/useTasks";
import { isApiError } from "@/lib/apiError";
import { forgetTask } from "@/lib/cache";
import { formatDate } from "@/lib/date";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function TaskDetail() {
	const params = useParams<{ projectId: string; taskId: string }>();
	const projectId = params.projectId;
	const taskId = params.taskId;

	const {
		data: currentUser,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const {
		data: task,
		isLoading,
		isError,
		error: taskError,
	} = useTask(projectId, taskId);
	const { data: members = [] } = useProjectMembers(projectId);
	const queryClient = useQueryClient();

	const currentMember = members.find(
		(member) => member.userId === currentUser?.id,
	);

	const canAssign = currentMember?.role === "MANAGER";

	useEffect(() => {
		if (isApiError(taskError) && taskError.status === 404) {
			forgetTask(queryClient, projectId, taskId);
		}
	}, [taskError, projectId, taskId, queryClient]);

	if (isAuthLoading) {
		return (
			<Container>
				<TaskDetailSkeleton />
			</Container>
		);
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return (
			<Container>
				<TaskDetailSkeleton />
			</Container>
		);
	}

	if (isError) {
		const taskIsGone = isApiError(taskError) && taskError.status === 404;

		return (
			<Container>
				{taskIsGone ? (
					<div className="space-y-3">
						<ErrorState message="This task is no longer available. It may have been deleted, or its project may have been removed." />

						<Link
							href={`/projects/${projectId}`}
							className="text-sm font-medium hover:underline">
							Back to project
						</Link>
					</div>
				) : (
					<ErrorState message="Failed to load task." />
				)}
			</Container>
		);
	}

	if (!task) {
		return (
			<Container>
				<div className="space-y-3">
					<ErrorState message="This task is no longer available." />

					<Link
						href={`/projects/${projectId}`}
						className="text-sm font-medium hover:underline">
						Back to project
					</Link>
				</div>
			</Container>
		);
	}

	return (
		<Container>
			<Link
				href={`/projects/${projectId}`}
				className="text-sm text-muted-foreground hover:text-foreground">
				← Back to project
			</Link>

			<div className="mt-4">
				<PageHeader
					title={task.title}
					description={`Updated ${formatDate(task.updatedAt)}`}
					actions={
						<>
							<EditTaskDialog projectId={projectId} task={task} />
							<DeleteTaskDialog
								taskId={task.id}
								projectId={projectId}
								taskTitle={task.title}
								redirectAfterDelete
							/>
						</>
					}
				/>
			</div>

			<Card className="mb-6 min-w-0">
				<dl className="grid min-w-0 gap-4 sm:grid-cols-2">
					<div className="min-w-0">
						<dt className="text-xs font-medium text-muted-foreground">
							Status
						</dt>
						<dd className="mt-1 text-sm">{taskStatusLabels[task.status]}</dd>
					</div>

					<div className="min-w-0">
						<dt className="text-xs font-medium text-muted-foreground">
							Priority
						</dt>
						<dd className="mt-1 text-sm">
							{taskPriorityLabels[task.priority]}
						</dd>
					</div>

					<div className="min-w-0">
						<dt className="text-xs font-medium text-muted-foreground">
							Due date
						</dt>
						<dd className="mt-1 text-sm">
							{task.dueDate === null
								? "No due date"
								: formatDate(task.dueDate)}
						</dd>
					</div>

					<div className="min-w-0">
						<dt className="text-xs font-medium text-muted-foreground">
							Created
						</dt>
						<dd className="mt-1 text-sm">
							{formatDate(task.createdAt)}
						</dd>
					</div>

					<div className="min-w-0 sm:col-span-2">
						<dt className="text-xs font-medium text-muted-foreground">
							Description
						</dt>
						<dd className="mt-1 wrap-break-word text-sm">
							{task.description || "No description"}
						</dd>
					</div>
				</dl>
			</Card>

			<Card className="min-w-0">
				<TaskAssigneeSelect
					projectId={projectId}
					taskId={task.id}
					assignedMember={task.assignedMember}
					members={members}
					canAssign={canAssign}
				/>
			</Card>
		</Container>
	);
}

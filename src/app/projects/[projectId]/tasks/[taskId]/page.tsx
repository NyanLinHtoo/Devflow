"use client";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState, LoadingState } from "@/components/ui/state";
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
import Link from "next/link";
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
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError) {
		return null;
	}

	if (isLoading) {
		return (
			<Container>
				<LoadingState label="Loading task..." />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container>
				<ErrorState message="Failed to load task." />
			</Container>
		);
	}

	if (!task) {
		return (
			<Container>
				<ErrorState message="Task not found." />
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
					description={`Updated ${new Date(task.updatedAt).toLocaleDateString()}`}
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

			<Card className="mb-6">
				<dl className="grid gap-4 sm:grid-cols-2">
					<div>
						<dt className="text-xs font-medium text-muted-foreground">
							Status
						</dt>
						<dd className="mt-1 text-sm">{taskStatusLabels[task.status]}</dd>
					</div>

					<div>
						<dt className="text-xs font-medium text-muted-foreground">
							Priority
						</dt>
						<dd className="mt-1 text-sm">
							{taskPriorityLabels[task.priority]}
						</dd>
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
						<dt className="text-xs font-medium text-muted-foreground">
							Created
						</dt>
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
			</Card>

			<Card>
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

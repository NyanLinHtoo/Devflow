"use client";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import MemberList from "@/features/members/components/MemberList";
import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import {
	projectStatusChipClasses,
	projectStatusLabels,
} from "@/features/projects/projectLabels";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TaskCard from "@/features/tasks/components/TaskCard";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useProject } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import { isApiError } from "@/lib/apiError";
import { forgetProject } from "@/lib/cache";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProjectDetail() {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId;

	const {
		data: currentUser,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const {
		data: project,
		isLoading,
		isError,
		error: projectError,
	} = useProject(projectId);
	const {
		data: tasks,
		isLoading: isTaskLoading,
		isError: isTaskError,
	} = useTasks(projectId);
	const { data: members = [] } = useProjectMembers(projectId);
	const queryClient = useQueryClient();

	const currentMember = members.find(
		(member) => member.userId === currentUser?.id,
	);
	const canManage = currentMember?.role === "MANAGER";

	useEffect(() => {
		if (isApiError(projectError) && projectError.status === 404) {
			forgetProject(queryClient, projectId);
		}
	}, [projectError, projectId, queryClient]);

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
				<LoadingState label="Loading project..." />
			</Container>
		);
	}

	if (isError) {
		const projectIsGone =
			isApiError(projectError) && projectError.status === 404;

		return (
			<Container>
				{projectIsGone ? (
					<div className="space-y-3">
						<ErrorState message="This project is no longer available. It may have been deleted, or you may have been removed." />

						<Link
							href="/projects"
							className="text-sm font-medium hover:underline">
							Back to projects
						</Link>
					</div>
				) : (
					<ErrorState message="Failed to load project." />
				)}
			</Container>
		);
	}

	if (!project) {
		return (
			<Container>
				<div className="space-y-3">
					<ErrorState message="This project is no longer available." />

					<Link
						href="/projects"
						className="text-sm font-medium hover:underline">
						Back to projects
					</Link>
				</div>
			</Container>
		);
	}

	return (
		<Container>
			<Link
				href="/projects"
				className="text-sm text-muted-foreground hover:text-foreground">
				← Back to projects
			</Link>

			<div className="mt-4">
				<PageHeader
					title={project.name}
					description={
						<>
							{project.description ? (
								<p className="wrap-break-word">{project.description}</p>
							) : null}
							<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
								<span
									className={`rounded-full px-2 py-0.5 font-medium ${projectStatusChipClasses[project.status]}`}>
									{projectStatusLabels[project.status]}
								</span>
								<span className="text-muted-foreground">
									{project.dueDate
										? `Due ${new Date(project.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
										: "No due date"}
								</span>
								<span className="text-muted-foreground">
									{project.doneTasks} / {project.totalTasks} tasks ·{" "}
									{project.progress}%
								</span>
							</div>
							<p className="mt-1 text-xs">
								Created {new Date(project.createdAt).toLocaleDateString()}
							</p>
						</>
					}
					actions={
						canManage ? (
							<>
								<EditProjectDialog project={project} />
								<DeleteProjectDialog
									projectId={projectId}
									projectName={project.name}
								/>
							</>
						) : undefined
					}
				/>
			</div>

			<div className="mb-8">
				<MemberList
					projectId={projectId}
					currentUserId={currentUser?.id}
					canManage={canManage}
				/>
			</div>

			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<h2 className="text-lg font-medium">Tasks</h2>
				<CreateTaskDialog projectId={projectId} />
			</div>

			{tasks && tasks.length > 0 ? (
				<div className="grid min-w-0 gap-4">
					{tasks.map((task) => (
						<TaskCard key={task.id} task={task} projectId={projectId} />
					))}
				</div>
			) : isTaskLoading ? (
				<LoadingState label="Loading tasks..." />
			) : isTaskError ? (
				<ErrorState message="Failed to load tasks." />
			) : (
				<EmptyState>
					No tasks yet. Create your first task to get started.
				</EmptyState>
			)}
		</Container>
	);
}

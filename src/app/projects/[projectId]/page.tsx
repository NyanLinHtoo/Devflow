"use client";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import TaskCard from "@/features/tasks/components/TaskCard";
import { useProject } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useTasks } from "@/hooks/useTasks";
import Link from "next/link";
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
		return (
			<Container>
				<ErrorState message="Failed to load project." />
			</Container>
		);
	}

	if (!project) {
		return (
			<Container>
				<ErrorState message="Project not found." />
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
							{project.description ? <p>{project.description}</p> : null}
							<p className="mt-1 text-xs">
								Created {new Date(project.createdAt).toLocaleDateString()}
							</p>
						</>
					}
					actions={
						<>
							<EditProjectDialog project={project} />
							<DeleteProjectDialog
								projectId={projectId}
								projectName={project.name}
							/>
						</>
					}
				/>
			</div>

			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<h2 className="text-lg font-medium">Tasks</h2>
				<CreateTaskDialog projectId={projectId} />
			</div>

			{tasks && tasks.length > 0 ? (
				<div className="grid gap-4">
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

"use client";

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

const container = "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6";

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
				<LoadingState label="Loading project..." />
			</main>
		);
	}

	if (isError) {
		return (
			<main className={container}>
				<ErrorState message="Failed to load project." />
			</main>
		);
	}

	if (!project) {
		return (
			<main className={container}>
				<ErrorState message="Project not found." />
			</main>
		);
	}

	return (
		<main className={container}>
			<Link
				href="/projects"
				className="text-sm text-muted-foreground hover:text-foreground">
				← Back to projects
			</Link>

			<div className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{project.name}
					</h1>

					{project.description && (
						<p className="mt-1 text-sm text-muted-foreground">
							{project.description}
						</p>
					)}

					<p className="mt-1 text-xs text-muted-foreground">
						Created {new Date(project.createdAt).toLocaleDateString()}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<EditProjectDialog project={project} />
					<DeleteProjectDialog
						projectId={projectId}
						projectName={project.name}
					/>
				</div>
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
		</main>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import {
	taskPriorityChipClasses,
	taskPriorityLabels,
	taskStatusChipClasses,
	taskStatusLabels,
} from "@/features/tasks/taskLabels";
import { useMyTasks } from "@/hooks/useMyTasks";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Link from "next/link";
import { useState } from "react";

type TaskFilter = "OPEN" | "DONE" | "ALL";

const filters: { value: TaskFilter; label: string }[] = [
	{ value: "OPEN", label: "Open" },
	{ value: "DONE", label: "Done" },
	{ value: "ALL", label: "All" },
];

function formatDueDate(dueDate: string) {
	return new Date(dueDate).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

export default function MyTasksPage() {
	const {
		data: user,
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const { data: tasks, isLoading, isError } = useMyTasks();
	const [filter, setFilter] = useState<TaskFilter>("OPEN");

	if (isAuthLoading) {
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError || !user) {
		return null;
	}

	if (isLoading) {
		return (
			<Container>
				<LoadingState label="Loading your tasks..." />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container>
				<ErrorState message="Failed to load your tasks." />
			</Container>
		);
	}

	const allTasks = tasks ?? [];
	const openCount = allTasks.filter((task) => task.status !== "DONE").length;
	const doneCount = allTasks.filter((task) => task.status === "DONE").length;
	const filteredTasks = allTasks.filter((task) => {
		if (filter === "ALL") {
			return true;
		}

		return filter === "DONE" ? task.status === "DONE" : task.status !== "DONE";
	});

	return (
		<Container>
			<PageHeader
				title="My tasks"
				description={`${openCount} open · ${doneCount} done across all projects`}
			/>

			<div className="mb-4 flex flex-wrap gap-2">
				{filters.map((item) => (
					<Button
						key={item.value}
						type="button"
						size="sm"
						variant={filter === item.value ? "primary" : "secondary"}
						onClick={() => setFilter(item.value)}>
						{item.label}
					</Button>
				))}
			</div>

			{filteredTasks.length === 0 ? (
				<EmptyState>
					{filter === "DONE"
						? "No completed tasks yet."
						: "No tasks assigned to you right now."}
				</EmptyState>
			) : (
				<Card className="p-0">
					<ul className="divide-y divide-border">
						{filteredTasks.map((task) => (
							<li key={task.id}>
								<Link
									href={`/projects/${task.projectId}/tasks/${task.id}`}
									className="block p-4 transition-colors hover:bg-surface-muted">
									<div className="flex items-start justify-between gap-3">
										<p className="text-sm font-medium">{task.title}</p>

										<span
											className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${taskPriorityChipClasses[task.priority]}`}>
											{taskPriorityLabels[task.priority]}
										</span>
									</div>

									<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
										<span>{task.projectName}</span>
										<span aria-hidden="true">·</span>

										<span
											className={`rounded-full px-2 py-0.5 font-medium ${taskStatusChipClasses[task.status]}`}>
											{taskStatusLabels[task.status]}
										</span>

										{task.dueDate ? (
											<>
												<span aria-hidden="true">·</span>
												<span>Due {formatDueDate(task.dueDate)}</span>
											</>
										) : null}
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Card>
			)}
		</Container>
	);
}

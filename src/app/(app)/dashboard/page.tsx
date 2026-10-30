"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import ProjectCard from "@/features/projects/components/ProjectCard";
import {
	taskPriorityChipClasses,
	taskPriorityLabels,
} from "@/features/tasks/taskLabels";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roleLabels } from "@/lib/roles";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatDueDate(dueDate: string) {
	return new Date(dueDate).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

export default function DashboardPage() {
	const router = useRouter();
	const {
		data: user,
		isLoading: isUserLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const {
		data: projects,
		isLoading: isProjectsLoading,
		isError: isProjectsError,
	} = useProjects();
	const {
		data: summary,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
	} = useDashboardSummary();

	if (isUserLoading) {
		return (
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isAuthError || !user) {
		return null;
	}

	const recentProjects = (projects ?? []).slice(0, 4);

	const stats = [
		{
			label: "Projects",
			value: summary?.projectCount ?? projects?.length ?? 0,
			hint: `${roleLabels[user.role]} account`,
		},
		{
			label: "Open tasks",
			value: summary?.openTaskCount ?? 0,
			hint: `${summary?.assignedTaskCount ?? 0} assigned to you`,
		},
		{
			label: "Due this week",
			value: summary?.dueThisWeekCount ?? 0,
			hint: `${summary?.overdueCount ?? 0} overdue`,
		},
		{
			label: "Team members",
			value: summary?.memberCount ?? 0,
			hint: "Across your projects",
		},
	];

	return (
		<Container>
			<PageHeader
				title={`Welcome back, ${user.fullName}`}
				description={`${user.email} · ${roleLabels[user.role]}`}
				actions={
					<Button variant="secondary" onClick={() => router.push("/projects")}>
						View projects
					</Button>
				}
			/>

			{isSummaryError ? (
				<ErrorState message="Failed to load the dashboard summary." />
			) : (
				<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<Card key={stat.label}>
							<p className="text-sm text-muted-foreground">{stat.label}</p>
							<p className="mt-1 text-2xl font-semibold">
								{isSummaryLoading ? "..." : stat.value}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
						</Card>
					))}
				</div>
			)}

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
				<section>
					<div className="mb-4 flex items-center justify-between gap-4">
						<h2 className="text-lg font-medium">Recent projects</h2>
						<Link
							href="/projects"
							className="text-sm text-muted-foreground hover:text-foreground">
							View all →
						</Link>
					</div>

					{isProjectsLoading ? (
						<LoadingState label="Loading projects..." />
					) : isProjectsError ? (
						<ErrorState message="Failed to load projects." />
					) : recentProjects.length === 0 ? (
						<EmptyState>
							No projects yet. Go to Projects to create or open one.
						</EmptyState>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							{recentProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</section>

				<section>
					<div className="mb-4 flex items-center justify-between gap-4">
						<h2 className="text-lg font-medium">Upcoming</h2>
					</div>

					{isSummaryLoading ? (
						<LoadingState label="Loading tasks..." />
					) : isSummaryError ? (
						<ErrorState message="Failed to load upcoming tasks." />
					) : !summary || summary.upcomingTasks.length === 0 ? (
						<EmptyState>No upcoming tasks.</EmptyState>
					) : (
						<Card className="p-0">
							<ul className="divide-y divide-border">
								{summary.upcomingTasks.map((task) => (
									<li key={task.id}>
										<Link
											href={`/projects/${task.projectId}/tasks/${task.id}`}
											className="block p-4 transition-colors hover:bg-surface-muted">
											<div className="flex items-start justify-between gap-2">
												<p className="text-sm font-medium">{task.title}</p>

												<span
													className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${taskPriorityChipClasses[task.priority]}`}>
													{taskPriorityLabels[task.priority]}
												</span>
											</div>

											<p className="mt-1 text-xs text-muted-foreground">
												{task.projectName}
												{task.dueDate
													? ` · ${formatDueDate(task.dueDate)}`
													: ""}
												{task.assigneeName ? ` · ${task.assigneeName}` : ""}
											</p>
										</Link>
									</li>
								))}
							</ul>
						</Card>
					)}
				</section>
			</div>
		</Container>
	);
}

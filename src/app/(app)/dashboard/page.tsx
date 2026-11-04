"use client";

import { DashboardSkeleton } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import {
	taskPriorityChipClasses,
	taskPriorityLabels,
} from "@/features/tasks/taskLabels";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { canCreateProjects } from "@/lib/roles";
import { CheckCircle2, Clock, FolderKanban, Users } from "lucide-react";
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
		isLoading: isAuthLoading,
		isError: isAuthError,
	} = useRequireAuth();
	const {
		data: summary,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
	} = useDashboardSummary();

	if (isAuthError) {
		return null;
	}

	if (isAuthLoading || (isSummaryLoading && !summary)) {
		return (
			<Container>
				<DashboardSkeleton />
			</Container>
		);
	}

	const recentProjects = summary?.recentProjects ?? [];
	const projectsThisMonth = summary?.projectsThisMonth ?? 0;
	const managerCount = summary?.managerCount ?? 0;

	const stats = [
		{
			label: "Projects",
			value: summary?.projectCount ?? 0,
			hint:
				projectsThisMonth > 0
					? `+${projectsThisMonth} this month`
					: "None this month",
			icon: FolderKanban,
		},
		{
			label: "Open tasks",
			value: summary?.openTaskCount ?? 0,
			hint: `${summary?.assignedTaskCount ?? 0} assigned to you`,
			icon: CheckCircle2,
		},
		{
			label: "Due this week",
			value: summary?.dueThisWeekCount ?? 0,
			hint: `${summary?.overdueCount ?? 0} overdue`,
			icon: Clock,
		},
		{
			label: "Team members",
			value: summary?.memberCount ?? 0,
			hint: `${managerCount} ${managerCount === 1 ? "manager" : "managers"}`,
			icon: Users,
		},
	];

	return (
		<Container>
			<PageHeader
				title={user ? `Welcome back, ${user.fullName}` : "Dashboard"}
				description={user?.email}
				actions={
					<>
						<Button
							variant="secondary"
							onClick={() => router.push("/projects")}>
							View projects
						</Button>
						{user && canCreateProjects(user.role) ? (
							<CreateProjectDialog />
						) : null}
					</>
				}
			/>

			{isSummaryError ? (
				<ErrorState message="Failed to load the dashboard summary." />
			) : (
				<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => {
						const Icon = stat.icon;

						return (
							<Card key={stat.label}>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Icon size={16} aria-hidden="true" />
									<span>{stat.label}</span>
								</div>
								<p className="mt-1 text-2xl font-semibold">{stat.value}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{stat.hint}
								</p>
							</Card>
						);
					})}
				</div>
			)}

			<div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
				<Card className="min-w-0 p-4">
					<div className="mb-4 flex items-center justify-between gap-4">
						<h2 className="text-lg font-medium">Recent projects</h2>
						<Link
							href="/projects"
							className="text-sm text-muted-foreground hover:text-foreground">
							View all →
						</Link>
					</div>

					{isSummaryError ? (
						<ErrorState message="Failed to load projects." />
					) : recentProjects.length === 0 ? (
						<EmptyState>
							No projects yet. Go to Projects to create or open one.
						</EmptyState>
					) : (
						<div className="grid gap-3 sm:grid-cols-2">
							{recentProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</Card>

				<div className="min-w-0 space-y-6">
					<Card className="min-w-0 p-4">
						<div className="mb-3 flex items-center justify-between gap-4">
							<h2 className="text-lg font-medium">Upcoming</h2>
						</div>

						{isSummaryError ? (
							<ErrorState message="Failed to load upcoming tasks." />
						) : !summary || summary.upcomingTasks.length === 0 ? (
							<EmptyState>No upcoming tasks.</EmptyState>
						) : (
							<ul className="divide-y divide-border">
								{summary.upcomingTasks.map((task) => (
									<li key={task.id}>
										<Link
											href={`/projects/${task.projectId}/tasks/${task.id}`}
											className="block min-w-0 rounded-md py-3 transition-colors hover:bg-surface-muted">
											<div className="flex min-w-0 items-start justify-between gap-2">
												<p className="min-w-0  wrap-anywhere text-sm font-medium">
													{task.title}
												</p>

												<span
													className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${taskPriorityChipClasses[task.priority]}`}>
													{taskPriorityLabels[task.priority]}
												</span>
											</div>

											<p className="mt-1  wrap-anywhere text-xs text-muted-foreground">
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
						)}
					</Card>
				</div>
			</div>
		</Container>
	);
}

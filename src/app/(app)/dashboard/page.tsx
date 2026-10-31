"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import ProjectCard from "@/features/projects/components/ProjectCard";
import {
	taskPriorityChipClasses,
	taskPriorityLabels,
} from "@/features/tasks/taskLabels";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useProjects } from "@/hooks/useProjects";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { roleLabels } from "@/lib/roles";
import { CheckCircle2, Clock, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatDueDate(dueDate: string) {
	return new Date(dueDate).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

function formatRelativeTime(isoDate: string) {
	const diffMs = Date.now() - new Date(isoDate).getTime();
	const minutes = Math.max(1, Math.round(diffMs / 60_000));

	if (minutes < 60) {
		return `${minutes}m ago`;
	}

	const hours = Math.round(minutes / 60);

	if (hours < 24) {
		return `${hours}h ago`;
	}

	const days = Math.round(hours / 24);
	return days === 1 ? "Yesterday" : `${days}d ago`;
}

function isThisMonth(isoDate: string) {
	const date = new Date(isoDate);
	const now = new Date();

	return (
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
	);
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
	const projectsThisMonth = (projects ?? []).filter((project) =>
		isThisMonth(project.createdAt),
	).length;

	const stats = [
		{
			label: "Projects",
			value: summary?.projectCount ?? projects?.length ?? 0,
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
			hint: `${summary?.managerCount ?? 0} managers`,
			icon: Users,
		},
	];

	return (
		<Container>
			<PageHeader
				title={`Welcome back, ${user.fullName}`}
				description={`${user.email} · ${roleLabels[user.role]}`}
				actions={
					<>
						<Button
							variant="secondary"
							onClick={() => router.push("/projects")}>
							View projects
						</Button>
						{user.role === "MANAGER" ? <CreateProjectDialog /> : null}
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
								<p className="mt-1 text-2xl font-semibold">
									{isSummaryLoading ? "..." : stat.value}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{stat.hint}
								</p>
							</Card>
						);
					})}
				</div>
			)}

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
				<Card className="p-4">
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
						<div className="grid gap-3 sm:grid-cols-2">
							{recentProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</Card>

				<div className="space-y-6">
					<Card className="p-4">
						<div className="mb-3 flex items-center justify-between gap-4">
							<h2 className="text-lg font-medium">Upcoming</h2>
						</div>

						{isSummaryLoading ? (
							<LoadingState label="Loading tasks..." />
						) : isSummaryError ? (
							<ErrorState message="Failed to load upcoming tasks." />
						) : !summary || summary.upcomingTasks.length === 0 ? (
							<EmptyState>No upcoming tasks.</EmptyState>
						) : (
							<ul className="divide-y divide-border">
								{summary.upcomingTasks.map((task) => (
									<li key={task.id}>
										<Link
											href={`/projects/${task.projectId}/tasks/${task.id}`}
											className="block rounded-md py-3 transition-colors hover:bg-surface-muted">
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
						)}
					</Card>

					<Card className="p-4">
						<div className="mb-3 flex items-center justify-between gap-4">
							<h2 className="text-lg font-medium">Activity</h2>
						</div>

						{isSummaryLoading ? (
							<LoadingState label="Loading activity..." />
						) : isSummaryError ? (
							<ErrorState message="Failed to load activity." />
						) : !summary || summary.recentActivity.length === 0 ? (
							<EmptyState>No recent activity.</EmptyState>
						) : (
							<div className="space-y-3">
								{summary.recentActivity.map((item) => (
									<div
										key={item.id}
										className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
										<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border" />

										<p>
											<span className="font-medium text-foreground">
												{item.actorName ?? "Someone"}
											</span>{" "}
											{item.status === "DONE" ? "completed" : "updated"}{" "}
											<span className="font-medium text-foreground">
												{item.title}
											</span>{" "}
											· {item.projectName} ·{" "}
											{formatRelativeTime(item.updatedAt)}
										</p>
									</div>
								))}
							</div>
						)}
					</Card>
				</div>
			</div>
		</Container>
	);
}

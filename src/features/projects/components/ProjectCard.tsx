import { Card } from "@/components/ui/card";
import {
	projectStatusChipClasses,
	projectStatusLabels,
} from "@/features/projects/projectLabels";
import Link from "next/link";
import type { Project } from "@/types/projectTypes";

function formatDueDate(dueDate: string) {
	return new Date(dueDate).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

type ProjectCardProps = {
	project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Link href={`/projects/${project.id}`} className="block">
			<Card className="h-full transition-colors hover:border-foreground/30">
				<div className="flex items-start justify-between gap-2">
					<h2 className="font-medium text-foreground">{project.name}</h2>

					<span
						className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${projectStatusChipClasses[project.status]}`}>
						{projectStatusLabels[project.status]}
					</span>
				</div>

				{project.description && (
					<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
						{project.description}
					</p>
				)}

				<div className="mt-3">
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
						<div
							className="h-full rounded-full bg-primary"
							style={{ width: `${project.progress}%` }}
						/>
					</div>

					<div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
						<span>
							{project.doneTasks} / {project.totalTasks} tasks
						</span>
						<span>{project.progress}%</span>
					</div>
				</div>

				<p className="mt-3 text-xs text-muted-foreground">
					{project.dueDate
						? `Due ${formatDueDate(project.dueDate)}`
						: "No due date"}
				</p>
			</Card>
		</Link>
	);
}

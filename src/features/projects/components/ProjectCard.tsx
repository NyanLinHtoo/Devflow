import { Card } from "@/components/ui/card";
import {
	projectStatusChipClasses,
	projectStatusLabels,
} from "@/features/projects/projectLabels";
import { getInitials } from "@/lib/initials";
import Link from "next/link";
import type { Project } from "@/types/projectTypes";

function formatDueDate(dueDate: string) {
	return new Date(dueDate).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

const avatarColors = [
	"bg-primary text-primary-foreground",
	"bg-[#bfe3ec] text-[#1f3a40]",
	"bg-[#f5c6dd] text-[#4a2333]",
];

type ProjectCardProps = {
	project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Link href={`/projects/${project.id}`} className="block min-w-0">
			<Card className="h-full min-w-0 transition-colors hover:border-foreground/30">
				<div className="flex items-start justify-between gap-2">
					<h2 className="line-clamp-2 min-w-0 wrap-break-word font-medium text-foreground">
						{project.name}
					</h2>

					<span
						className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${projectStatusChipClasses[project.status]}`}>
						{projectStatusLabels[project.status]}
					</span>
				</div>

				{project.description && (
					<p className="mt-2 line-clamp-2 wrap-break-word text-sm text-muted-foreground">
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

				<div className="mt-3 flex items-center justify-between gap-2">
					<div className="flex items-center">
						{project.members.slice(0, 3).map((member, index) => (
							<span
								key={member.id}
								className={`flex size-6 items-center justify-center rounded-full border-2 border-surface text-[10px] font-semibold ${avatarColors[index % avatarColors.length]} ${
									index > 0 ? "-ml-1.5" : ""
								}`}>
								{getInitials(member.fullName)}
							</span>
						))}

						{project.memberCount > 3 ? (
							<span className="-ml-1.5 flex size-6 items-center justify-center rounded-full border-2 border-surface bg-surface-muted text-[10px] font-semibold text-muted-foreground">
								+{project.memberCount - 3}
							</span>
						) : null}
					</div>

					<span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
						{project.dueDate
							? `Due ${formatDueDate(project.dueDate)}`
							: "No due date"}
					</span>
				</div>
			</Card>
		</Link>
	);
}

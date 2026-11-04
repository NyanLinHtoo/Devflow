import { Card } from "@/components/ui/card";
import {
	taskPriorityLabels,
	taskStatusLabels,
} from "@/features/tasks/taskLabels";
import { formatDate } from "@/lib/date";
import type { Task } from "@/types/taskTypes";
import Link from "next/link";

type TaskCardProps = {
	task: Task;
	projectId: string;
};

export default function TaskCard({ task, projectId }: TaskCardProps) {
	return (
		<Link
			href={`/projects/${projectId}/tasks/${task.id}`}
			className="block min-w-0">
			<Card className="min-w-0 transition-colors hover:border-foreground/30">
				<div className="flex items-start justify-between gap-3">
					<h2 className="min-w-0 wrap-break-word font-medium text-foreground">
						{task.title}
					</h2>
					<span className="shrink-0 text-xs text-muted-foreground">
						{taskPriorityLabels[task.priority]}
					</span>
				</div>

				{task.description && (
					<p className="mt-2 line-clamp-2 wrap-break-word text-sm text-muted-foreground">
						{task.description}
					</p>
				)}

				<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 wrap-break-word text-xs text-muted-foreground">
					<span>{taskStatusLabels[task.status]}</span>
					<span aria-hidden="true">·</span>
					<span>
						{task.dueDate === null
							? "No due date"
							: formatDate(task.dueDate)}
					</span>
					<span aria-hidden="true">·</span>
					<span>
						{task.assignedMember
							? `Assigned to ${task.assignedMember.fullName}`
							: "Not assigned yet"}
					</span>
				</div>
			</Card>
		</Link>
	);
}

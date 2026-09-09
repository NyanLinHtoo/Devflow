import type { Task } from "@/types/taskTypes";
import Link from "next/link";

type TaskCardProps = {
	task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
	return (
		<Link href={`#`}>
			<article className="rounded-lg border border-gray-200 p-4">
				<h2 className="font-semibold">{task.title}</h2>
				{task.description && (
					<p className="mt-2 text-sm text-gray-600">{task.description}</p>
				)}
				<p className="mt-2 text-sm text-gray-600">{task.status}</p>
				<p className="mt-2 text-sm text-gray-600">{task.priority}</p>
				<p>
					Due Date :{" "}
					{task.dueDate === null
						? "No Due Date"
						: new Date(task.dueDate).toDateString()}
				</p>
			</article>
		</Link>
	);
}

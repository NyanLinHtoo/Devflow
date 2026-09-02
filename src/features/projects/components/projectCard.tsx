import Link from "next/link";
import type { Project } from "@/types/projectTypes";

type ProjectCardProps = {
	project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Link href={`/projects/${project.id}`}>
			<article className="rounded-lg border border-gray-200 p-4">
				<h2 className="font-semibold">{project.name}</h2>

				{project.description && (
					<p className="mt-2 text-sm text-gray-600">{project.description}</p>
				)}
			</article>
		</Link>
	);
}

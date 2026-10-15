import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { Project } from "@/types/projectTypes";

type ProjectCardProps = {
	project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Link href={`/projects/${project.id}`} className="block">
			<Card className="h-full transition-colors hover:border-foreground/30">
				<h2 className="font-medium text-foreground">{project.name}</h2>

				{project.description && (
					<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
						{project.description}
					</p>
				)}
			</Card>
		</Link>
	);
}

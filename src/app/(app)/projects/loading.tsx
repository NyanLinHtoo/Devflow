import { ProjectsSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function ProjectsLoading() {
	return (
		<Container>
			<ProjectsSkeleton />
		</Container>
	);
}

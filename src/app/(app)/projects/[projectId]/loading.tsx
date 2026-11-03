import { ProjectDetailSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function ProjectDetailLoading() {
	return (
		<Container>
			<ProjectDetailSkeleton />
		</Container>
	);
}

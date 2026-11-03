import { TasksSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function TasksLoading() {
	return (
		<Container>
			<TasksSkeleton />
		</Container>
	);
}

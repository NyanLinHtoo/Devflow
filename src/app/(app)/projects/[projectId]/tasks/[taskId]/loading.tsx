import { TaskDetailSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function TaskDetailLoading() {
	return (
		<Container>
			<TaskDetailSkeleton />
		</Container>
	);
}

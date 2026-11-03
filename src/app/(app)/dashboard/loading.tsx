import { DashboardSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function DashboardLoading() {
	return (
		<Container>
			<DashboardSkeleton />
		</Container>
	);
}

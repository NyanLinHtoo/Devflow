import { AdminUsersSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function AdminUsersLoading() {
	return (
		<Container>
			<AdminUsersSkeleton />
		</Container>
	);
}

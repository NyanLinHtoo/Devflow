import { ProfileSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";

export default function ProfileLoading() {
	return (
		<Container>
			<ProfileSkeleton />
		</Container>
	);
}

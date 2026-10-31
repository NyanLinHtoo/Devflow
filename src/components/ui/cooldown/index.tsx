import { formatCountdown } from "@/lib/countdown";

type CooldownNoticeProps = {
	remaining: number;
	message?: string;
};

export function CooldownNotice({
	remaining,
	message = "Try again in",
}: CooldownNoticeProps) {
	if (remaining <= 0) {
		return null;
	}

	return (
		<p role="status" className="text-sm text-warning">
			{message} {formatCountdown(remaining)}
		</p>
	);
}

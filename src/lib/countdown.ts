export function formatCountdown(totalSeconds: number) {
	const safe = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;

	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

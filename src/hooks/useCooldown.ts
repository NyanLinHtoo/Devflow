"use client";

import { useEffect, useState } from "react";

export function useCooldown() {
	const [until, setUntil] = useState<number | null>(null);
	const [remaining, setRemaining] = useState(0);

	useEffect(() => {
		if (!until) {
			return;
		}

		const interval = setInterval(() => {
			const next = Math.max(0, Math.ceil((until - Date.now()) / 1000));

			setRemaining(next);

			if (next === 0) {
				setUntil(null);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [until]);

	function start(seconds: number) {
		const safe = Math.max(1, Math.ceil(seconds));

		setUntil(Date.now() + safe * 1000);
		setRemaining(safe);
	}

	return { remaining, isActive: remaining > 0, start };
}

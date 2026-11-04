const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

export function formatDate(value: string | Date | null | undefined) {
	if (!value) {
		return "";
	}

	const date = typeof value === "string" ? new Date(value) : value;

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return displayDateFormatter.format(date);
}

export function dateToInputValue(date: Date) {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function inputValueToDate(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	return new Date(`${value}T00:00:00`);
}

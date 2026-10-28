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

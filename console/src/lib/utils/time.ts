export const durationToHumanReadable = (lifetime: number): string => {
	const seconds = Math.floor(lifetime / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	const secondsString = `${seconds % 60}s`;
	const minutesString = minutes > 0 ? `${minutes % 60}m ` : "";
	const hoursString = hours > 0 ? `${hours}h ` : "";

	return `${hoursString}${minutesString}${secondsString}`;
};

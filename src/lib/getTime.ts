/**
 * Converts milliseconds duration to a formatted time string (HH:mm)
 * @param duration - Duration in milliseconds
 * @returns Formatted time string
 */
const getTime = (duration: string | number): string => {
  const ms = Number(duration);
  if (!duration || isNaN(ms)) return "0:00";

  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursPart = hours > 0 ? `${hours} ساعة و ` : "";
  return `${hoursPart}${minutes < 10 ? "0" : ""}${minutes} دقيقة`;
};
export default getTime;

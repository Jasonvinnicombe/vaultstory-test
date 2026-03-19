import { addMonths, addYears, format, formatDistanceToNowStrict, isAfter, parseISO, setYear } from "date-fns";

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function fromNow(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function resolveRelativeUnlock(amount: number, unit: "months" | "years", startDate = new Date()) {
  return unit === "years" ? addYears(startDate, amount) : addMonths(startDate, amount);
}

export function resolveNextBirthdayUnlock(birthdayIso: string, now = new Date()) {
  const birthday = parseISO(birthdayIso);
  let nextBirthday = setYear(birthday, now.getFullYear());

  if (!isAfter(nextBirthday, now)) {
    nextBirthday = setYear(birthday, now.getFullYear() + 1);
  }

  return nextBirthday;
}

export function resolveAgeMilestoneUnlock(birthdateIso: string, age: number) {
  return addYears(parseISO(birthdateIso), age);
}

const MONTHS_LONG = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const MONTHS_SHORT = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

function parseDate(isoString: string): Date {
  return new Date(isoString);
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatTime(isoString: string): string {
  const d = parseDate(isoString);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDate(isoString: string): string {
  const d = parseDate(isoString);
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)} - ${formatTime(isoString)}`;
}

export function formatMonthDay(isoString: string): { day: number; month: string } {
  const d = parseDate(isoString);
  // MONTHS_SHORT is a fixed array of 12 strings; index 0-11 always
  // exists, but noUncheckedIndexedAccess still widens the type to
  // `string | undefined`. The `?? "Ara"` only fires for an off-by-one
  // edge case where getDate()/getMonth() ever returned NaN.
  const monthIndex = d.getMonth();
  return {
    day: d.getDate(),
    month: MONTHS_SHORT[monthIndex] ?? MONTHS_SHORT[0] ?? "",
  };
}

export function localDateInputValue(isoString: string): string {
  const d = parseDate(isoString);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function localTimeInputValue(isoString: string): string {
  const d = parseDate(isoString);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function todayLocalDateInputValue(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toLocalIsoString(dateStr: string, timeStr: string): string {
  const [rawY, rawMo, rawD] = dateStr.split("-").map(Number);
  const [rawH, rawMi] = timeStr.split(":").map(Number);
  // Defaults keep strict-mode happy. The Date constructor itself
  // tolerates undefined, but noUncheckedIndexedAccess widens the tuple
  // elements to number|undefined so we coalesce explicitly.
  const y = rawY ?? new Date().getFullYear();
  const mo = (rawMo ?? 1) - 1;
  const d = rawD ?? 1;
  const h = rawH ?? 0;
  const mi = rawMi ?? 0;
  const local = new Date(y, mo, d, h, mi, 0, 0);
  return local.toISOString();
}

export function combineLocal(dateStr: string, timeStr: string, fallbackTime: string): string {
  if (dateStr && timeStr) return toLocalIsoString(dateStr, timeStr);
  if (dateStr) {
    return toLocalIsoString(dateStr, fallbackTime);
  }
  return fallbackTime;
}

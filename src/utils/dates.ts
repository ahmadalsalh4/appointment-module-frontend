/**
 * The single canonical timezone for the booking system. The backend
 * (`Staff::BUSINESS_TIMEZONE`) and Postgres session timezone are pinned
 * to this exact IANA id, so any date math on the frontend MUST be done
 * in this zone — using the browser's local zone would mis-pick the day
 * for users outside Europe/Istanbul (e.g. a 09:00 Istanbul slot stored
 * as 06:00 UTC would be filtered out by date-only comparisons).
 */
export const BUSINESS_TIMEZONE = "Europe/Istanbul";

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

/**
 * Returns wall-clock parts for `date` projected into the given IANA tz.
 * Uses Intl.DateTimeFormat which handles DST transitions natively — no
 * moment-timezone or luxon dependency required.
 */
function partsInTz(
  date: Date,
  tz: string,
): { y: number; mo: number; d: number; h: number; mi: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const lookup = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  // Safari emits "24" for midnight with hour12:false. Normalise.
  const hourRaw = lookup.hour ?? "00";
  const hour = hourRaw === "24" ? "00" : hourRaw;
  return {
    y: parseInt(lookup.year ?? "1970", 10),
    mo: parseInt(lookup.month ?? "01", 10),
    d: parseInt(lookup.day ?? "01", 10),
    h: parseInt(hour, 10),
    mi: parseInt(lookup.minute ?? "00", 10),
  };
}

// ============================================================
// Istanbul-aware formatters
// ------------------------------------------------------------
// All formatters below project the timestamp into Europe/Istanbul
// before formatting. The legacy `formatTime`/`formatDate` etc.
// functions used `Date#getHours()`/`getDate()` which return values
// in the browser's local zone — wrong for any non-Istanbul user.
// New code should prefer the *Istanbul variants. The legacy names
// are kept as thin aliases so existing call sites keep compiling;
// each legacy name now delegates to the Istanbul variant.
// ============================================================

/**
 * Format the time-of-day (HH:mm) of an ISO timestamp as observed in
 * Europe/Istanbul, not the browser's local timezone.
 */
export function formatTimeIstanbul(isoString: string): string {
  const { h, mi } = partsInTz(parseDate(isoString), BUSINESS_TIMEZONE);
  return `${pad(h)}:${pad(mi)}`;
}

/**
 * Format the calendar date in long Turkish format ("29 Temmuz 2026")
 * as observed in Europe/Istanbul.
 */
export function formatDateIstanbul(isoString: string): string {
  const { y, mo, d } = partsInTz(parseDate(isoString), BUSINESS_TIMEZONE);
  const monthName = MONTHS_LONG[mo - 1] ?? "";
  return `${d} ${monthName} ${y}`;
}

/**
 * Format the date + time as observed in Europe/Istanbul.
 */
export function formatDateTimeIstanbul(isoString: string): string {
  return `${formatDateIstanbul(isoString)} - ${formatTimeIstanbul(isoString)}`;
}

/**
 * Return day-of-month + short Turkish month name in Europe/Istanbul.
 */
export function formatMonthDayIstanbul(
  isoString: string,
): { day: number; month: string } {
  const { mo, d } = partsInTz(parseDate(isoString), BUSINESS_TIMEZONE);
  const monthIndex = mo - 1;
  return {
    day: d,
    month: MONTHS_SHORT[monthIndex] ?? MONTHS_SHORT[0] ?? "",
  };
}

/**
 * Format the calendar date as a YYYY-MM-DD string in Europe/Istanbul.
 * Use this to set the `value` of an <input type="date">.
 */
export function localDateInputValueIstanbul(isoString: string): string {
  const { y, mo, d } = partsInTz(parseDate(isoString), BUSINESS_TIMEZONE);
  return `${y}-${pad(mo)}-${pad(d)}`;
}

/**
 * Format the time-of-day as HH:mm in Europe/Istanbul.
 * Use this to set the `value` of an <input type="time">.
 */
export function localTimeInputValueIstanbul(isoString: string): string {
  const { h, mi } = partsInTz(parseDate(isoString), BUSINESS_TIMEZONE);
  return `${pad(h)}:${pad(mi)}`;
}

/**
 * Returns today's date in BUSINESS_TIMEZONE formatted for an
 * <input type="date"> value (YYYY-MM-DD). Use this instead of
 * todayLocalDateInputValue() anywhere the calendar day is going to be
 * sent to the backend or compared against business-hours validation.
 */
export function todayIstanbulDateInputValue(): string {
  const { y, mo, d } = partsInTz(new Date(), BUSINESS_TIMEZONE);
  return `${y}-${pad(mo)}-${pad(d)}`;
}

/**
 * Combines a calendar date ("YYYY-MM-DD") and time ("HH:MM") into a
 * wall-clock ISO 8601 string with NO timezone designator
 * (e.g. "2026-07-29T10:00:00"). The backend's
 *   Carbon::parse($value, "Europe/Istanbul")
 * interprets it as the chosen wall-clock in Istanbul, regardless of the
 * user's browser timezone. This avoids the bug where a 10:00 browser-
 * local slot gets stored as the wrong instant because the frontend
 * used `new Date(2026, 6, 29, 10, 0).toISOString()` (which converts to
 * UTC).
 */
export function toIstanbulNaiveIso(dateStr: string, timeStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  if (!/^\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error(`Invalid time string: ${timeStr}`);
  }
  const [rawY, rawMo, rawD] = dateStr.split("-").map(Number);
  const [rawH, rawMi] = timeStr.split(":").map(Number);
  const y = rawY ?? 1970;
  const mo = rawMo ?? 1;
  const d = rawD ?? 1;
  const h = rawH ?? 0;
  const mi = rawMi ?? 0;
  return `${pad(y)}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00`;
}

/**
 * Same contract as toIstanbulNaiveIso; combines with an optional fallback
 * time when only a date was picked (e.g. admin reschedule).
 */
export function combineIstanbul(
  dateStr: string,
  timeStr: string,
  fallbackTime: string,
): string {
  const effectiveTime = timeStr.trim() ? timeStr : fallbackTime;
  if (dateStr) return toIstanbulNaiveIso(dateStr, effectiveTime);
  return toIstanbulNaiveIso(todayIstanbulDateInputValue(), effectiveTime);
}

// ============================================================
// Legacy aliases — kept so existing call sites keep compiling.
// These now delegate to the Istanbul-aware implementations so
// every consumer (regardless of browser timezone) sees the right
// time. New code should prefer the *Istanbul variants directly.
// ============================================================

export const formatTime = formatTimeIstanbul;
export const formatDate = formatDateIstanbul;
export const formatDateTime = formatDateTimeIstanbul;
export const formatMonthDay = formatMonthDayIstanbul;
export const localDateInputValue = localDateInputValueIstanbul;
export const localTimeInputValue = localTimeInputValueIstanbul;
export const todayLocalDateInputValue = todayIstanbulDateInputValue;

// Backend-bound aliases — the names lie about their semantics
// (they actually emit Istanbul-wall-clock strings, not browser-local).
// Keep for backward compatibility but the Istanbul variants are
// preferred for new code.
export const toBackendIsoString = toIstanbulNaiveIso;
export const combineBackendIso = combineIstanbul;
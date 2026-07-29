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
  const effectiveTime = timeStr || fallbackTime;
  if (dateStr) return toIstanbulNaiveIso(dateStr, effectiveTime);
  return toIstanbulNaiveIso(todayIstanbulDateInputValue(), effectiveTime);
}

// Backwards-compatible aliases. Existing call sites that haven't migrated
// yet still compile; new code should prefer the Istanbul helpers.
export const toLocalIsoString = toIstanbulNaiveIso;
export const combineLocal = combineIstanbul;

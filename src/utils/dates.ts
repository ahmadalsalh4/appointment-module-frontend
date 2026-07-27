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
  return {
    day: d.getDate(),
    month: MONTHS_SHORT[d.getMonth()],
  };
}

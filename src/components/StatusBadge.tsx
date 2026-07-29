interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CLASSES: Record<string, string> = {
  pending: "badge badge-pending",
  confirmed: "badge badge-confirmed",
  completed: "badge badge-completed",
  cancelled: "badge badge-cancelled",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const known = Object.prototype.hasOwnProperty.call(STATUS_CLASSES, status);
  if (!known && typeof console !== "undefined") {
    // Surface unknown backend statuses in dev so we don't leak raw
    // codes like "rescheduled" into the UI silently.
    console.warn(`[StatusBadge] Unknown status: ${status}`);
  }
  const badgeClass = STATUS_CLASSES[status] ?? "badge";
  const label = STATUS_LABELS[status] ?? "Bilinmiyor";

  return <span className={`${badgeClass} ${className}`.trim()}>{label}</span>;
}

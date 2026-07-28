import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortableThProps {
  field: string;
  currentField?: string;
  currentOrder?: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}

const ALIGN_CLASSES = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export default function SortableTh({
  field,
  currentField,
  currentOrder,
  onSort,
  className = "",
  children,
  align = "left",
}: SortableThProps) {
  const isActive = currentField === field;
  const Icon = !isActive
    ? ArrowUpDown
    : currentOrder === "asc"
      ? ArrowUp
      : ArrowDown;
  const ariaSort = !isActive ? "none" : currentOrder === "asc" ? "ascending" : "descending";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-3 sm:px-6 py-3 ${ALIGN_CLASSES[align]} text-xs font-bold text-main/60 uppercase tracking-wider ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1 hover:text-main transition-colors ${
          isActive ? "text-deep" : ""
        } ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        <span>{children}</span>
        <Icon className="h-3.5 w-3.5" />
      </button>
    </th>
  );
}

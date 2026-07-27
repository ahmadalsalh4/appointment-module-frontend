import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const perPageOptions = [10, 15, 25, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-main/5">
      <div className="text-sm text-main/60">
        {total > 0
          ? `${from}-${to} / ${total} kayıt`
          : "0 kayıt"}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="text-sm border border-main/10 rounded-lg px-2 py-1.5 bg-surface text-main/70 focus:border-deep focus:ring-1 focus:ring-deep/20 outline-none"
        >
          {perPageOptions.map((n) => (
            <option key={n} value={n}>
              {n} / sayfa
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-main/60 hover:bg-deep/10 hover:text-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {generatePageNumbers(currentPage, lastPage).map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-main/40">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-deep text-white"
                  : "text-main/60 hover:bg-deep/10 hover:text-deep"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="p-2 rounded-lg text-main/60 hover:bg-deep/10 hover:text-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function generatePageNumbers(
  current: number,
  last: number,
): (number | "...")[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < last - 2) pages.push("...");

  pages.push(last);
  return pages;
}

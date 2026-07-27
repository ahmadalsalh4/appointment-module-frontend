import type { ReactNode } from "react";

interface AppointmentFiltersProps {
  statusId: string;
  onStatusChange: (v: string) => void;
  date: string;
  onDateChange: (v: string) => void;
  tab?: string;
  onTabChange?: (v: string) => void;
  customerName?: string;
  onCustomerNameChange?: (v: string) => void;
  sortBy?: string;
  onSortByChange?: (v: string) => void;
  sortOrder?: string;
  onSortOrderChange?: (v: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  showCustomerSearch?: boolean;
  showSort?: boolean;
  children?: ReactNode;
}

const TABS = [
  { value: "upcoming", label: "Yaklaşan" },
  { value: "pending", label: "Onay Bekleyen" },
  { value: "completed", label: "Tamamlanan" },
  { value: "cancelled", label: "İptal Edilen" },
];

export default function AppointmentFilters({
  statusId,
  onStatusChange,
  date,
  onDateChange,
  tab,
  onTabChange,
  customerName,
  onCustomerNameChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClear,
  hasActiveFilters,
  showCustomerSearch,
  showSort,
  children,
}: AppointmentFiltersProps) {
  return (
    <div className="card p-4 space-y-3">
      {onTabChange && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTabChange("")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              !tab
                ? "bg-deep text-white"
                : "bg-back text-main/60 hover:bg-deep/10 hover:text-deep"
            }`}
          >
            Tümü
          </button>
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => onTabChange(t.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                tab === t.value
                  ? "bg-deep text-white"
                  : "bg-back text-main/60 hover:bg-deep/10 hover:text-deep"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {showCustomerSearch && onCustomerNameChange && (
          <div className="lg:col-span-2">
            <label className="label-sm">Müşteri Ara</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Ad veya soyad..."
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>
        )}
        <div>
          <label className="label-sm">Durum</label>
          <select
            value={statusId}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
          >
            <option value="">Tümü</option>
            <option value="1">Beklemede</option>
            <option value="2">Onaylandı</option>
            <option value="3">Tamamlandı</option>
            <option value="4">İptal Edildi</option>
          </select>
        </div>
        {children}
        <div>
          <label className="label-sm">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
          />
        </div>
      </div>

      {showSort && onSortByChange && onSortOrderChange && (
        <div className="flex items-center gap-3 pt-2 border-t border-main/5">
          <label className="text-xs font-semibold text-main/40">Sırala:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-sm border border-main/10 rounded-lg px-2 py-1 bg-surface text-main/70"
          >
            <option value="start_date">Tarih</option>
            <option value="state_id">Durum</option>
            <option value="created_at">Oluşturma</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
            className="text-sm px-2 py-1 rounded-lg bg-back text-main/60 hover:bg-deep/10 hover:text-deep"
          >
            {sortOrder === "asc" ? "↑ Artan" : "↓ Azalan"}
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClear}
            className="text-xs font-semibold text-deep hover:underline"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}

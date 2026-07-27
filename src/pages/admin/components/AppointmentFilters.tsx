import type { ReactNode } from "react";

interface AppointmentFiltersProps {
  statusId: string;
  onStatusChange: (v: string) => void;
  date: string;
  onDateChange: (v: string) => void;
  customerName?: string;
  onCustomerNameChange?: (v: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  showCustomerSearch?: boolean;
  children?: ReactNode;
}

export default function AppointmentFilters({
  statusId,
  onStatusChange,
  date,
  onDateChange,
  customerName,
  onCustomerNameChange,
  onClear,
  hasActiveFilters,
  showCustomerSearch,
  children,
}: AppointmentFiltersProps) {
  return (
    <div className="card p-4">
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
      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
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

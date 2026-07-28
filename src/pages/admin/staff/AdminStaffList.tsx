import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, Search, ArrowUpDown } from "lucide-react";
import {
  useGetAllStaffQuery,
  useDeleteStaffMutation,
} from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";
import QueryGate from "../../../components/QueryGate";
import Avatar from "../../../components/Avatar";
import Pagination from "../../../components/Pagination";
import { SkeletonStaffCard } from "../../../components/skeletons/SkeletonPatterns";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";

export default function AdminStaffList() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: staffData, isLoading, isError } = useGetAllStaffQuery({
    per_page: perPage,
    page,
    name: name || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const staffList = staffData?.data ?? [];
  const deleteMut = useDeleteStaffMutation();

  const handleSortToggle = () => {
    if (sortBy === "name") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("name");
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: "Personeli Sil",
      description:
        "Bu personeli silmek istediğinize emin misiniz? Personelin geçmiş randevuları veritabanında kalacaktır.",
      confirmLabel: "Evet, Sil",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Personel silindi.");
    } catch {
      toast.error("Personel silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="page-xl space-y-6">
      <PageHeader
        title="Personel"
        subtitle="Sistemdeki personelleri yönetin ve yeni ekleyin."
        action={
          <Link to="/admin/staff/add" className="btn-primary">
            + Yeni Personel Ekle
          </Link>
        }
      />

      <div className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-main/40" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPage(1);
            }}
            placeholder="Ad veya soyada göre ara..."
            className="input-filter pl-9 focus:border-deep focus:ring-2 focus:ring-deep/20"
          />
        </div>
        <button
          type="button"
          onClick={handleSortToggle}
          className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
            sortBy === "name" ? "bg-deep/10 text-deep" : "text-main/60 hover:bg-back"
          }`}
        >
          <ArrowUpDown className="h-4 w-4" />
          Ada göre {sortBy === "name" && (sortOrder === "asc" ? "(A→Z)" : "(Z→A)")}
        </button>
      </div>

      <QueryGate
        isLoading={isLoading}
        isError={isError}
        errorMessage="Personel listesi yüklenirken hata oluştu."
        loading={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonStaffCard key={i} />
            ))}
          </div>
        }
      >
      {/* Cards Grid instead of table for better profile view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.length > 0 ? (
          staffList.map((staff) => (
            <div
              key={staff.id}
              className="card p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  name={staff.person.name}
                  surname={staff.person.surname}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-main truncate">
                    {staff.person.name} {staff.person.surname}
                  </p>
                  <p className="text-xs text-deep font-medium truncate">
                    {staff.job_title}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2 mb-4 text-sm">
                <div className="flex items-center text-main/60 truncate">
                  <Mail className="h-4 w-4 mr-2 shrink-0" />
                  {staff.email}
                </div>
                <div className="flex items-center text-main/60">
                  <Phone className="h-4 w-4 mr-2 shrink-0" />
                  {staff.person.phone_number}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-main/5 flex items-center justify-end gap-4 text-sm font-medium">
                <Link
                  to={`/admin/staff/${staff.id}`}
                  className="text-deep hover:text-deep/80"
                >
                  Detay
                </Link>
                <Link
                  to={`/admin/staff/${staff.id}/edit`}
                  className="text-waiting hover:text-waiting/80"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(staff.id)}
                  disabled={deleteMut.isPending}
                  className="text-canceld hover:text-canceld/80 disabled:text-main/40"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 bg-surface rounded-xl border border-main/10 text-main/60">
            Sistemde henüz bir personel bulunmuyor.
          </div>
        )}
      </div>
      </QueryGate>

      {staffData && (
        <Pagination
          currentPage={staffData.current_page}
          lastPage={staffData.last_page}
          perPage={staffData.per_page}
          total={staffData.total}
          from={staffData.from}
          to={staffData.to}
          onPageChange={setPage}
          onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
        />
      )}
    </div>
  );
}

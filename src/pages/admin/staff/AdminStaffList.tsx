import { Link } from "react-router";
import {
  useGetAllStaffQuery,
  useDeleteStaffMutation,
} from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";
import Avatar from "../../../components/Avatar";

export default function AdminStaffList() {
  const queryClient = useQueryClient();
  const { data: staffList, isLoading, isError } = useGetAllStaffQuery();
  const deleteMut = useDeleteStaffMutation();

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Bu personeli silmek istediğinize emin misiniz? Personelin geçmiş/randevuları veritabanında kalacaktır.",
      )
    )
      return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch {
      alert("Personel silinirken bir hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-canceld">
        <p className="text-xl font-bold">
          Personel listesi yüklenirken hata oluştu.
        </p>
      </div>
    );
  }

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

      {/* Cards Grid instead of table for better profile view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList && staffList.length > 0 ? (
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {staff.email}
                </div>
                <div className="flex items-center text-main/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
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
    </div>
  );
}

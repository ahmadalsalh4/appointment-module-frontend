import { Link } from "react-router";
import {
  useGetAllStaffQuery,
  useDeleteStaffMutation,
} from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">
          Personel listesi yüklenirken hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Personel</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Sistemdeki personelleri yönetin ve yeni ekleyin.
          </p>
        </div>
        <Link
          to="/admin/staff/add"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Yeni Personel Ekle
        </Link>
      </div>

      {/* Cards Grid instead of table for better profile view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList && staffList.length > 0 ? (
          staffList.map((staff) => (
            <div
              key={staff.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-lg font-bold">
                  {staff.person.name.charAt(0)}
                  {staff.person.surname.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {staff.person.name} {staff.person.surname}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                    {staff.job_title}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 truncate">
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
                <div className="flex items-center text-gray-500 dark:text-gray-400">
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
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4 text-sm font-medium">
                <Link
                  to={`/admin/staff/${staff.id}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  Detay
                </Link>
                <Link
                  to={`/admin/staff/${staff.id}/edit`}
                  className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(staff.id)}
                  disabled={deleteMut.isPending}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 dark:disabled:text-gray-500"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            Sistemde henüz bir personel bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}

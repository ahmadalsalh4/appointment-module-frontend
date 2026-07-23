import { Link } from "react-router";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminServicesList() {
  const queryClient = useQueryClient();
  const { data: services, isLoading, isError } = useGetAllServicesQuery();
  const deleteMut = useDeleteServiceMutation();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch {
      alert("Hizmet silinirken bir hata oluştu.");
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
        <p className="text-xl font-bold">Hizmetler yüklenirken hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Hizmetler</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Sistemdeki tüm hizmetleri görüntüleyin ve yönetin.
          </p>
        </div>
        <Link
          to="/admin/services/add"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Yeni Hizmet Ekle
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Hizmet Adı
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Süre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {services && services.length > 0 ? (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {service.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {service.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">Kategorisiz</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {service.duration} Dakika
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/services/${service.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                    >
                      Detay
                    </Link>
                    <Link
                      to={`/admin/services/${service.id}/edit`}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-4"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMut.isPending}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 dark:disabled:text-gray-500"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Sistemde henüz bir hizmet eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

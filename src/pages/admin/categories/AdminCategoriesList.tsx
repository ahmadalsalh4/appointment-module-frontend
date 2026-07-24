import { Link } from "react-router";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminCategoriesList() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery();
  const deleteMut = useDeleteCategoryMutation();

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait hizmetler kategorisiz kalacaktır.",
      )
    )
      return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      alert("Kategori silinirken bir hata oluştu.");
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
          Kategoriler yüklenirken hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-wrap-balance">Kategoriler</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Hizmetleri gruplandırmak için kategorileri yönetin.
          </p>
        </div>
        <Link
          to="/admin/categories/add"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Yeni Kategori Ekle
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Kategori Adı
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Oluşturulma Tarihi
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(
                        category.created_at.split("T")[0] + "T00:00:00",
                      ).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/categories/${category.id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 sm:mr-4"
                      >
                        Detay
                      </Link>
                      <Link
                        to={`/admin/categories/${category.id}/edit`}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 sm:mr-4"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
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
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Sistemde henüz bir kategori eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

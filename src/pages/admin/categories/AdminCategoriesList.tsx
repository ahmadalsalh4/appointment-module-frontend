import { Link } from "react-router";
import { List } from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";
import { formatDate } from "../../../utils/dates";

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
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-canceld">
        <p className="text-xl font-bold">
          Kategoriler yüklenirken hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="page-xl space-y-6">
      <PageHeader
        title="Kategoriler"
        subtitle="Hizmetleri gruplandırmak için kategorileri yönetin."
        action={
          <Link to="/admin/categories/add" className="btn-primary">
            + Yeni Kategori Ekle
          </Link>
        }
      />

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-main/10">
            <thead className="bg-back">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Kategori Adı
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
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
            <tbody className="bg-surface divide-y divide-main/5">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-back transition-colors"
                  >
                    <td className="table-cell whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="icon-box shrink-0">
                          <List className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold text-main">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell whitespace-nowrap text-sm text-main/60">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="table-cell whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/categories/${category.id}`}
                        className="text-deep hover:text-deep/80 sm:mr-4"
                      >
                        Detay
                      </Link>
                      <Link
                        to={`/admin/categories/${category.id}/edit`}
                        className="text-waiting hover:text-waiting/80 sm:mr-4"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteMut.isPending}
                        className="text-canceld hover:text-canceld/80 disabled:text-main/40"
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
                    className="px-6 py-12 text-center text-main/60"
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

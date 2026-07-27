import { useState } from "react";
import { Link } from "react-router";
import { List } from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../../../utils/dates";
import AdminListPage from "../components/AdminListPage";
import Pagination from "../../../components/Pagination";
import type { Category } from "../../../other/types";
import type { AdminListColumn } from "../components/AdminListPage";

const columns: AdminListColumn[] = [
  { header: "Kategori Adı" },
  { header: "Oluşturulma Tarihi" },
  {
    header: "İşlemler",
    className:
      "px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
  },
];

export default function AdminCategoriesList() {
  const queryClient = useQueryClient();
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const { data: categoriesData, isLoading, isError } = useGetAllCategoriesQuery({ per_page: perPage, page });
  const categories = categoriesData?.data ?? [];
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

  return (
    <AdminListPage
      title="Kategoriler"
      subtitle="Hizmetleri gruplandırmak için kategorileri yönetin."
      addPath="/admin/categories/add"
      addLabel="+ Yeni Kategori Ekle"
      columns={columns}
      itemsCount={categoriesData?.total ?? 0}
      emptyMessage="Sistemde henüz bir kategori eklenmemiş."
      isLoading={isLoading}
      isError={isError}
      errorMessage="Kategoriler yüklenirken hata oluştu."
    >
      {categories.map((category: Category) => (
        <tr key={category.id} className="hover:bg-back transition-colors">
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
      ))}
      {categoriesData && (
        <Pagination
          currentPage={categoriesData.current_page}
          lastPage={categoriesData.last_page}
          perPage={categoriesData.per_page}
          total={categoriesData.total}
          from={categoriesData.from}
          to={categoriesData.to}
          onPageChange={setPage}
          onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
        />
      )}
    </AdminListPage>
  );
}

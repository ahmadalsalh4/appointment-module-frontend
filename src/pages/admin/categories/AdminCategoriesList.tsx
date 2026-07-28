import { useState } from "react";
import { Link } from "react-router";
import { List, Search } from "lucide-react";
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
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";

const columns: AdminListColumn[] = [
  { header: "Kategori Adı", sortField: "name" },
  { header: "Oluşturulma Tarihi", sortField: "created_at" },
  {
    header: "İşlemler",
    className:
      "px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
  },
];

export default function AdminCategoriesList() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: categoriesData, isLoading, isError } = useGetAllCategoriesQuery({
    per_page: perPage,
    page,
    name: name || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const categories = categoriesData?.data ?? [];
  const deleteMut = useDeleteCategoryMutation();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: "Kategoriyi Sil",
      description:
        "Bu kategoriyi silmek istediğinize emin misiniz? Bu kategoriye ait hizmetler kategorisiz kalacaktır.",
      confirmLabel: "Evet, Sil",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori silindi.");
    } catch {
      toast.error("Kategori silinirken bir hata oluştu.");
    }
  };

  return (
    <>
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
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
      toolbar={
        <div className="card p-3 sm:p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-main/40" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPage(1);
              }}
              placeholder="Kategori adına göre ara..."
              className="input-filter pl-9 focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>
        </div>
      }
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
    </AdminListPage>

    {categoriesData && (
      <div className="page-xl">
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
      </div>
    )}
    </>
  );
}

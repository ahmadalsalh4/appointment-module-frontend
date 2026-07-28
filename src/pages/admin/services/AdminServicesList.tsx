import { useState } from "react";
import { Link } from "react-router";
import { Clock, Search } from "lucide-react";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useQueryClient } from "@tanstack/react-query";
import AdminListPage from "../components/AdminListPage";
import Pagination from "../../../components/Pagination";
import type { ServiceWithCategory } from "../../../other/types";
import type { AdminListColumn } from "../components/AdminListPage";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";

const columns: AdminListColumn[] = [
  { header: "Hizmet Adı", sortField: "name" },
  { header: "Kategori", sortField: "catagory_id" },
  { header: "Süre", sortField: "duration" },
  {
    header: "İşlemler",
    className:
      "px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
  },
];

export default function AdminServicesList() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: servicesData, isLoading, isError } = useGetAllServicesQuery({
    per_page: perPage,
    page,
    name: name || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const services = servicesData?.data ?? [];
  const deleteMut = useDeleteServiceMutation();

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
      title: "Hizmeti Sil",
      description: "Bu hizmeti silmek istediğinize emin misiniz?",
      confirmLabel: "Evet, Sil",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Hizmet silindi.");
    } catch {
      toast.error("Hizmet silinirken bir hata oluştu.");
    }
  };

  return (
    <>
    <AdminListPage
      title="Hizmetler"
      subtitle="Sistemdeki tüm hizmetleri görüntüleyin ve yönetin."
      addPath="/admin/services/add"
      addLabel="+ Yeni Hizmet Ekle"
      columns={columns}
      itemsCount={servicesData?.total ?? 0}
      emptyMessage="Sistemde henüz bir hizmet eklenmemiş."
      isLoading={isLoading}
      isError={isError}
      errorMessage="Hizmetler yüklenirken hata oluştu."
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
              placeholder="Hizmet adına göre ara..."
              className="input-filter pl-9 focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>
        </div>
      }
    >
      {services.map((service: ServiceWithCategory) => (
        <tr key={service.id} className="hover:bg-back transition-colors">
          <td className="table-cell whitespace-nowrap">
            <div className="text-sm font-semibold text-main">
              {service.name}
            </div>
          </td>
          <td className="table-cell whitespace-nowrap">
            {service.category ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-deep/10 text-deep">
                {service.category.name}
              </span>
            ) : (
              <span className="text-sm text-main/40">Kategorisiz</span>
            )}
          </td>
          <td className="table-cell whitespace-nowrap">
            <div className="flex items-center text-sm text-main/80">
              <Clock className="h-4 w-4 mr-1.5 text-main/40 shrink-0" />
              {service.duration} Dakika
            </div>
          </td>
          <td className="table-cell whitespace-nowrap text-right text-sm font-medium">
            <Link
              to={`/admin/services/${service.id}`}
              className="text-deep hover:text-deep/80 sm:mr-4"
            >
              Detay
            </Link>
            <Link
              to={`/admin/services/${service.id}/edit`}
              className="text-waiting hover:text-waiting/80 sm:mr-4"
            >
              Düzenle
            </Link>
            <button
              onClick={() => handleDelete(service.id)}
              disabled={deleteMut.isPending}
              className="text-canceld hover:text-canceld/80 disabled:text-main/40"
            >
              Sil
            </button>
          </td>
        </tr>
      ))}
    </AdminListPage>

    {servicesData && (
      <div className="page-xl">
        <Pagination
          currentPage={servicesData.current_page}
          lastPage={servicesData.last_page}
          perPage={servicesData.per_page}
          total={servicesData.total}
          from={servicesData.from}
          to={servicesData.to}
          onPageChange={setPage}
          onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
        />
      </div>
    )}
    </>
  );
}

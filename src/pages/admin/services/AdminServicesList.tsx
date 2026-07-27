import { Link } from "react-router";
import { Clock } from "lucide-react";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useQueryClient } from "@tanstack/react-query";
import AdminListPage from "../components/AdminListPage";
import type { ServiceWithCategory } from "../../../other/types";
import type { AdminListColumn } from "../components/AdminListPage";

const columns: AdminListColumn[] = [
  { header: "Hizmet Adı" },
  { header: "Kategori" },
  { header: "Süre" },
  {
    header: "İşlemler",
    className:
      "px-3 sm:px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
  },
];

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

  return (
    <AdminListPage
      title="Hizmetler"
      subtitle="Sistemdeki tüm hizmetleri görüntüleyin ve yönetin."
      addPath="/admin/services/add"
      addLabel="+ Yeni Hizmet Ekle"
      columns={columns}
      itemsCount={services?.length ?? 0}
      emptyMessage="Sistemde henüz bir hizmet eklenmemiş."
      isLoading={isLoading}
      isError={isError}
      errorMessage="Hizmetler yüklenirken hata oluştu."
    >
      {services?.map((service: ServiceWithCategory) => (
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
  );
}

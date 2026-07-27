import { Link } from "react-router";
import { Clock } from "lucide-react";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/PageHeader";

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
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-canceld">
        <p className="text-xl font-bold">Hizmetler yüklenirken hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="page-xl space-y-6">
      <PageHeader
        title="Hizmetler"
        subtitle="Sistemdeki tüm hizmetleri görüntüleyin ve yönetin."
        action={
          <Link to="/admin/services/add" className="btn-primary">
            + Yeni Hizmet Ekle
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
                  Hizmet Adı
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Kategori
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Süre
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
              {services && services.length > 0 ? (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-back transition-colors"
                  >
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-main/60"
                  >
                    Sistemde henüz bir hizmet eklenmemiş.
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

import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, ServiceRequestBody } from "../../../other/types";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import AdminFormPage from "../components/AdminFormPage";

export default function AdminServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: service, isLoading: isLoadingService } = useGetServiceByIdQuery(
    id || "",
  );
  const { data: categories } = useGetAllCategoriesQuery();
  const updateMut = useUpdateServiceMutation();

  const [formData, setFormData] = useState<ServiceRequestBody>(() => ({
    catagory_id: service?.catagory_id ?? "",
    name: service?.name ?? "",
    duration: service?.duration ?? 30,
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMut.mutateAsync({ id, data: formData });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      navigate("/admin/services");
    } catch {
      alert("Hizmet güncellenirken bir hata oluştu.");
    }
  };

  return (
    <AdminFormPage
      key={service?.id ?? "loading"}
      title="Hizmeti Düzenle"
      breadcrumbs={[
        { label: "Hizmetler", to: "/admin/services" },
        { label: service?.name || "", to: `/admin/services/${id}` },
        { label: "Düzenle" },
      ]}
      cancelTo={`/admin/services/${id}`}
      isPending={updateMut.isPending}
      submitLabel="Güncelle"
      isLoading={isLoadingService}
      onSubmit={handleSubmit}
    >
      <div>
        <label className="label">
          Hizmet Adı
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        />
      </div>

      <div>
        <label className="label">
          Kategori
        </label>
        <select
          required
          value={formData.catagory_id}
          onChange={(e) =>
            setFormData({ ...formData, catagory_id: e.target.value })
          }
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        >
          <option value="">Kategori Seçin...</option>
          {categories?.data?.map((cat: Category) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">
          Süre (Dakika)
        </label>
        <input
          type="number"
          required
          min="5"
          step="5"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: Number(e.target.value) })
          }
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        />
      </div>
    </AdminFormPage>
  );
}

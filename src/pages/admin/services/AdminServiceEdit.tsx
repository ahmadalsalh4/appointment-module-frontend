import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";

import { useQueryClient } from "@tanstack/react-query";
import type { ServiceRequestBody } from "../../../other/types";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";

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
    catagory_id: service?.catagory_id || "",
    name: service?.name || "",
    duration: service?.duration || 30,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (isLoadingService) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <Breadcrumb items={[
        { label: "Hizmetler", to: "/admin/services" },
        { label: service?.name || "", to: `/admin/services/${id}` },
        { label: "Düzenle" },
      ]} />

      <div className="card-lg p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
          Hizmeti Düzenle
        </h1>

        <form onSubmit={handleSubmit} className="section-gap-sm">
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
              {categories?.map((cat) => (
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

          <FormActions
            cancelTo={`/admin/services/${id}`}
            isPending={updateMut.isPending}
            submitLabel="Güncelle"
          />
        </form>
      </div>
    </div>
  );
}

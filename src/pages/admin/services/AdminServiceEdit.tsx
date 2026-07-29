import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, ServiceRequestBody, ServiceWithCategory } from "../../../other/types";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "../../../hooks/useServiceQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import { useToast } from "../../../hooks/useToast";
import { getErrorMessage } from "../../../utils/errors";
import AdminFormPage from "../components/AdminFormPage";
import Loading from "../../components/Loading";

interface ServiceEditFormProps {
  service: ServiceWithCategory;
  categories: Category[];
  onSubmit: (data: ServiceRequestBody) => void;
  isPending: boolean;
}

function ServiceEditForm({ service, categories, onSubmit, isPending }: ServiceEditFormProps) {
  const [formData, setFormData] = useState<ServiceRequestBody>({
    category_id: service.category_id ?? "",
    name: service.name ?? "",
    duration: service.duration ?? 30,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AdminFormPage
      title="Hizmeti Düzenle"
      breadcrumbs={[
        { label: "Hizmetler", to: "/admin/services" },
        { label: service.name, to: `/admin/services/${service.id}` },
        { label: "Düzenle" },
      ]}
      cancelTo={`/admin/services/${service.id}`}
      isPending={isPending}
      submitLabel="Güncelle"
      isLoading={false}
      onSubmit={handleSubmit}
    >
      <div>
        <label className="label">Hizmet Adı</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        />
      </div>

      <div>
        <label className="label">Kategori</label>
        <select
          required
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        >
          <option value="">Kategori Seçin...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Süre (Dakika)</label>
        <input
          type="number"
          required
          min="5"
          step="5"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        />
      </div>
    </AdminFormPage>
  );
}

export default function AdminServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: service, isLoading: isLoadingService } = useGetServiceByIdQuery(id || "");
  const { data: categories } = useGetAllCategoriesQuery();
  const updateMut = useUpdateServiceMutation();

  const handleSubmit = async (formData: ServiceRequestBody) => {
    if (!id) return;
    try {
      await updateMut.mutateAsync({ id, data: formData });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      navigate("/admin/services");
    } catch (err) {
      toast.error(getErrorMessage(err, "Hizmet güncellenirken bir hata oluştu."));
    }
  };

  if (isLoadingService) {
    return <Loading />;
  }

  if (!service) {
    return (
      <div className="page-xl text-center text-canceld">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
      </div>
    );
  }

  return (
    <ServiceEditForm
      key={service.id}
      service={service}
      categories={categories?.data ?? []}
      onSubmit={handleSubmit}
      isPending={updateMut.isPending}
    />
  );
}

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, ServiceRequestBody } from "../../../other/types";
import { useCreateServiceMutation } from "../../../hooks/useServiceQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import AdminFormPage from "../components/AdminFormPage";

export default function AdminServiceAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateServiceMutation();
  const { data: categories } = useGetAllCategoriesQuery();

  const [formData, setFormData] = useState<ServiceRequestBody>({
    catagory_id: "",
    name: "",
    duration: 30,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["services"] });
      navigate("/admin/services");
    } catch {
      alert("Hizmet eklenirken bir hata oluştu.");
    }
  };

  return (
    <AdminFormPage
      title="Yeni Hizmet Oluştur"
      breadcrumbs={[
        { label: "Hizmetler", to: "/admin/services" },
        { label: "Yeni Ekle" },
      ]}
      cancelTo="/admin/services"
      isPending={createMut.isPending}
      submitLabel="Hizmeti Kaydet"
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
          placeholder="Örn: Matematik Dersi"
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
          placeholder="30"
        />
        <p className="mt-1 text-xs text-main/60">
          Bu hizmetin ortalama kaç dakika sürer?
        </p>
      </div>
    </AdminFormPage>
  );
}

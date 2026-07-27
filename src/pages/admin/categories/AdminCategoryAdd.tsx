import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useCreateCategoryMutation } from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";
import AdminFormPage from "../components/AdminFormPage";

export default function AdminCategoryAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateCategoryMutation();

  const [formData, setFormData] = useState<CategoryRequestBody>({
    name: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/categories");
    } catch {
      alert("Kategori eklenirken bir hata oluştu.");
    }
  };

  return (
    <AdminFormPage
      title="Yeni Kategori Oluştur"
      breadcrumbs={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: "Yeni Ekle" },
      ]}
      cancelTo="/admin/categories"
      isPending={createMut.isPending}
      submitLabel="Kategoriyi Kaydet"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="label">
          Kategori Adı
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
          placeholder="Örn: Eğitim, Sağlık, Teknoloji"
        />
      </div>
    </AdminFormPage>
  );
}

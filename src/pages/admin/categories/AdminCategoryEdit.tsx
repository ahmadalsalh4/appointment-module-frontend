import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";
import AdminFormPage from "../components/AdminFormPage";

export default function AdminCategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: category, isLoading: isLoadingCategory } =
    useGetCategoryByIdQuery(id || "");
  const updateMut = useUpdateCategoryMutation();

  const [formData, setFormData] = useState<CategoryRequestBody>(() => ({
    name: category?.name ?? "",
  }));

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name ?? "" });
    }
  }, [category]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMut.mutateAsync({ id, data: formData });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/categories");
    } catch {
      alert("Kategori güncellenirken bir hata oluştu.");
    }
  };

  return (
    <AdminFormPage
      title="Kategoriyi Düzenle"
      breadcrumbs={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: category?.name || "", to: `/admin/categories/${id}` },
        { label: "Düzenle" },
      ]}
      cancelTo={`/admin/categories/${id}`}
      isPending={updateMut.isPending}
      submitLabel="Güncelle"
      isLoading={isLoadingCategory}
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
        />
      </div>
    </AdminFormPage>
  );
}

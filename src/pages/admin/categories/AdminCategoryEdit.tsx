import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";

export default function AdminCategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: category, isLoading: isLoadingCategory } =
    useGetCategoryByIdQuery(id || "");
  const updateMut = useUpdateCategoryMutation();

  const [formData, setFormData] = useState<CategoryRequestBody>(() => ({
    name: category?.name || "",
  }));

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (isLoadingCategory) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <Breadcrumb items={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: category?.name || "", to: `/admin/categories/${id}` },
        { label: "Düzenle" },
      ]} />

      <div className="card-lg p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
          Kategoriyi Düzenle
        </h1>

        <form onSubmit={handleSubmit} className="section-gap-sm">
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

          <FormActions
            cancelTo={`/admin/categories/${id}`}
            isPending={updateMut.isPending}
            submitLabel="Güncelle"
          />
        </form>
      </div>
    </div>
  );
}

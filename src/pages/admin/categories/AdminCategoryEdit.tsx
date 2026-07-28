import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody, CategoryWithServices } from "../../../other/types";
import { useToast } from "../../../hooks/useToast";
import AdminFormPage from "../components/AdminFormPage";
import Loading from "../../components/Loading";

interface CategoryEditFormProps {
  category: CategoryWithServices;
  onSubmit: (data: CategoryRequestBody) => void;
  isPending: boolean;
}

function CategoryEditForm({ category, onSubmit, isPending }: CategoryEditFormProps) {
  const [formData, setFormData] = useState<CategoryRequestBody>({
    name: category.name ?? "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AdminFormPage
      title="Kategoriyi Düzenle"
      breadcrumbs={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: category.name, to: `/admin/categories/${category.id}` },
        { label: "Düzenle" },
      ]}
      cancelTo={`/admin/categories/${category.id}`}
      isPending={isPending}
      submitLabel="Güncelle"
      isLoading={false}
      onSubmit={handleSubmit}
    >
      <div>
        <label className="label">Kategori Adı</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
        />
      </div>
    </AdminFormPage>
  );
}

export default function AdminCategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(id || "");
  const updateMut = useUpdateCategoryMutation();

  const handleSubmit = async (formData: CategoryRequestBody) => {
    if (!id) return;
    try {
      await updateMut.mutateAsync({ id, data: formData });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/admin/categories");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Kategori güncellenirken bir hata oluştu.");
    }
  };

  if (isLoadingCategory) {
    return <Loading />;
  }

  if (!category) {
    return (
      <div className="page-xl text-center text-canceld">
        <p className="text-xl font-bold">Kategori bulunamadı.</p>
      </div>
    );
  }

  return (
    <CategoryEditForm
      key={category.id}
      category={category}
      onSubmit={handleSubmit}
      isPending={updateMut.isPending}
    />
  );
}

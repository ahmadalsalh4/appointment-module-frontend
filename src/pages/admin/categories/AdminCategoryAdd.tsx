import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateCategoryMutation } from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";

export default function AdminCategoryAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateCategoryMutation();

  const [formData, setFormData] = useState<CategoryRequestBody>({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="page">
      <Breadcrumb items={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: "Yeni Ekle" },
      ]} />

      <div className="card-lg p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
          Yeni Kategori Oluştur
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
              placeholder="Örn: Eğitim, Sağlık, Teknoloji"
            />
          </div>

          <FormActions
            cancelTo="/admin/categories"
            isPending={createMut.isPending}
            submitLabel="Kategoriyi Kaydet"
          />
        </form>
      </div>
    </div>
  );
}

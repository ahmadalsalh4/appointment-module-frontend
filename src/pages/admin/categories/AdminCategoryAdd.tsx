import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCreateCategoryMutation } from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/admin/categories" className="hover:text-indigo-600">
          Kategoriler
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Yeni Ekle</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Yeni Kategori Oluştur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori Adı
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Örn: Eğitim, Sağlık, Teknoloji"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              to="/admin/categories"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {createMut.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Kaydediliyor...
                </>
              ) : (
                "Kategoriyi Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

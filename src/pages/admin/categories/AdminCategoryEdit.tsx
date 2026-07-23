import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryRequestBody } from "../../../other/types";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/admin/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Kategoriler
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/admin/categories/${id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">Düzenle</span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Kategoriyi Düzenle
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Kategori Adı
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              to={`/admin/categories/${id}`}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={updateMut.isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {updateMut.isPending ? "Kaydediliyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

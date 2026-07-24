import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

import { useQueryClient } from "@tanstack/react-query";
import type { ServiceRequestBody } from "../../../other/types";
import { useCreateServiceMutation } from "../../../hooks/useServiceQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";

export default function AdminServiceAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateServiceMutation();
  const { data: categories } = useGetAllCategoriesQuery();

  const [formData, setFormData] = useState<ServiceRequestBody>({
    catagory_id: "",
    name: "",
    duration: 30, // Varsayılan süre
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/admin/services" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Hizmetler
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">Yeni Ekle</span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-wrap-balance">
          Yeni Hizmet Oluştur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Hizmet Adı
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Örn: Matematik Dersi"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Kategori
            </label>
            <select
              required
              value={formData.catagory_id}
              onChange={(e) =>
                setFormData({ ...formData, catagory_id: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="30"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Bu hizmetin ortalama kaç dakika sürer?
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/admin/services"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {createMut.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Kaydediliyor...
                </>
              ) : (
                "Hizmeti Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateStaffRequestBody } from "../../../other/types";

export default function AdminStaffEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Detaylı sorgu (isimleri göstermek için)
  const { data: staff, isLoading: isLoadingStaff } = useGetStaffByIdQuery(
    id || "",
  );
  const updateMut = useUpdateStaffMutation();

  const [formData, setFormData] = useState<UpdateStaffRequestBody>(() => ({
    job_title: staff?.job_title || "",
    email: staff?.email || "",
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMut.mutateAsync({ id, data: formData });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      navigate("/admin/staff");
    } catch  {
      alert("Personel güncellenirken bir hata oluştu.");
    }
  };

  if (isLoadingStaff) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/admin/staff" className="hover:text-indigo-600">
          Personel
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/admin/staff/${id}`} className="hover:text-indigo-600">
          {staff?.person.name} {staff?.person.surname}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Düzenle</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Not:</strong> Ad, soyad ve telefon numarası gibi kişisel
          bilgiler buradan değiştirilemez. Sadece iş ile ilgili bilgiler
          güncellenebilir.
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          İş Bilgilerini Düzenle
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pozisyon / Görev
            </label>
            <input
              type="text"
              required
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İş E-Posta (Giriş E-Postası)
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              to={`/admin/staff/${id}`}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={updateMut.isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {updateMut.isPending ? "Kaydediliyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

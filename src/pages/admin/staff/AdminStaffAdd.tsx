import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCreateStaffMutation } from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateStaffRequestBody } from "../../../other/types";

export default function AdminStaffAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateStaffMutation();

  const [formData, setFormData] = useState<CreateStaffRequestBody>({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    password: "",
    job_title: "",
    job_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMut.mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      navigate("/admin/staff");
    } catch {
      alert("Personel eklenirken bir hata oluştu.");
    }
  };

  const updateField = (field: keyof CreateStaffRequestBody, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/admin/staff" className="hover:text-indigo-600">
          Personel
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Yeni Ekle</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Yeni Personel Oluştur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ad
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Soyad
              </label>
              <input
                type="text"
                required
                value={formData.surname}
                onChange={(e) => updateField("surname", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefon Numarası
            </label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) => updateField("phone_number", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="05555555555"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="En az 6 karakter"
            />
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-md font-bold text-gray-800 mb-4">
              İş Bilgileri
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pozisyon / Görev
                </label>
                <input
                  type="text"
                  required
                  value={formData.job_title}
                  onChange={(e) => updateField("job_title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Örn: Uzman Doktor, Matematik Öğretmeni"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kişisel E-Posta
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İş E-Posta
                </label>
                <input
                  type="email"
                  required
                  value={formData.job_email}
                  onChange={(e) => updateField("job_email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Personelin sisteme giriş yapacağı e-posta adresi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              to="/admin/staff"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
            >
              {createMut.isPending ? "Kaydediliyor..." : "Personeli Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

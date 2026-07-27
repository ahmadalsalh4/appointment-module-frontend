import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateStaffMutation } from "../../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateStaffRequestBody } from "../../../other/types";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";

export default function AdminStaffAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createMut = useCreateStaffMutation();
  const { data: categories } = useGetAllCategoriesQuery(); // BUNU EKLEYİN

  const [formData, setFormData] = useState<CreateStaffRequestBody>({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    password: "",
    catagory_id: "", // BUNU EKLEYİN
    job_title: "",
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
    <div className="page">
      <Breadcrumb items={[
        { label: "Personel", to: "/admin/staff" },
        { label: "Yeni Ekle" },
      ]} />

      <div className="card-lg p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
          Yeni Personel Oluştur
        </h1>

        <form onSubmit={handleSubmit} className="section-gap-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                Ad
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              />
            </div>
            <div>
              <label className="label">
                Soyad
              </label>
              <input
                type="text"
                required
                value={formData.surname}
                onChange={(e) => updateField("surname", e.target.value)}
                className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              />
            </div>
          </div>
          <div>
            <label className="label">
              Telefon Numarası
            </label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) => updateField("phone_number", e.target.value)}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="05555555555"
            />
          </div>
          <div>
            <label className="label">
              Şifre
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label className="label">
              İlgili Olduğu Kategori
            </label>
            <select
              value={formData.catagory_id}
              onChange={(e) => updateField("catagory_id", e.target.value)}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Kategori Seçin (Opsiyonel)</option>
              {categories?.data?.map((cat: any) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-main/60">
              Personelin hangi kategoride hizmet vereceğini seçin.
            </p>
          </div>
          <div className="border-t border-main/5 pt-6 mt-6">
            <h3 className="text-base sm:text-lg font-bold text-main mb-4">
              İş Bilgileri
            </h3>
            <div className="space-y-6">
              <div>
                <label className="label">
                  Pozisyon / Görev
                </label>
                <input
                  type="text"
                  required
                  value={formData.job_title}
                  onChange={(e) => updateField("job_title", e.target.value)}
                  className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
                  placeholder="Örn: Uzman Doktor, Matematik Öğretmeni"
                />
              </div>

              <div>
                <label className="label">
                  E-Posta
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
                />
              </div>
            </div>
          </div>
          <FormActions
            cancelTo="/admin/staff"
            isPending={createMut.isPending}
            submitLabel="Personeli Kaydet"
          />
        </form>
      </div>
    </div>
  );
}

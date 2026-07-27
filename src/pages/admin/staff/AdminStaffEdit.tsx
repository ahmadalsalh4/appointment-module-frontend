import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from "../../../hooks/useStaffQueries";
import { useGetAllCategoriesQuery } from "../../../hooks/useCategoryQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { Category, UpdateStaffRequestBody, StaffEntityDetailed } from "../../../other/types";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";
import QueryGate from "../../../components/QueryGate";

function StaffEditForm({ staff }: { staff: StaffEntityDetailed }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useGetAllCategoriesQuery();
  const updateMut = useUpdateStaffMutation();

  const [formData, setFormData] = useState<UpdateStaffRequestBody>({
    job_title: staff.job_title || "",
    email: staff.email || "",
    catagory_id: staff.catagory_id ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const payload: UpdateStaffRequestBody = {
        job_title: formData.job_title,
        email: formData.email,
        catagory_id:
          formData.catagory_id === "" || formData.catagory_id === null
            ? null
            : formData.catagory_id,
      };
      await updateMut.mutateAsync({ id, data: payload });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      navigate("/admin/staff");
    } catch {
      alert("Personel güncellenirken bir hata oluştu.");
    }
  };

  return (
    <div className="page">
      <Breadcrumb items={[
        { label: "Personel", to: "/admin/staff" },
        { label: `${staff.person.name} ${staff.person.surname}`, to: `/admin/staff/${id}` },
        { label: "Düzenle" },
      ]} />

      <div className="card-lg p-8">
        <div className="mb-6 p-4 bg-waiting/15 border border-waiting/20 rounded-lg text-sm text-waiting">
          <strong>Not:</strong> Ad, soyad ve telefon numarası gibi kişisel
          bilgiler buradan değiştirilemez. Sadece iş ile ilgili bilgiler
          (kategori, pozisyon, e-posta) güncellenebilir.
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
          İş Bilgilerini Düzenle
        </h1>

        <form onSubmit={handleSubmit} className="section-gap-sm">
          <div>
            <label className="label">
              İlgili Olduğu Kategori
            </label>
            <select
              value={formData.catagory_id ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, catagory_id: e.target.value })
              }
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Kategori Seçin (Opsiyonel)</option>
              {categories?.data?.map((cat: Category) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-main/60">
              Personelin hangi kategoride hizmet vereceğini seçin.
            </p>
          </div>

          <div>
            <label className="label">
              Pozisyon / Görev
            </label>
            <input
              type="text"
              required
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>

          <div>
            <label className="label">
              İş E-Posta (Giriş E-Postası)
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>

          <FormActions
            cancelTo={`/admin/staff/${id}`}
            isPending={updateMut.isPending}
            submitLabel="Güncelle"
          />
        </form>
      </div>
    </div>
  );
}

export default function AdminStaffEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: staff, isLoading: isLoadingStaff } = useGetStaffByIdQuery(
    id || "",
  );

  return (
    <QueryGate isLoading={isLoadingStaff} isError={!staff} errorMessage="Personel bulunamadı.">
      {staff && <StaffEditForm key={staff.id} staff={staff} />}
    </QueryGate>
  );
}

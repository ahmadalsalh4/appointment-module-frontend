import { useParams, Link } from "react-router";
import { useGetStaffByIdQuery } from "../../../hooks/useStaffQueries";
import Breadcrumb from "../../../components/Breadcrumb";
import Avatar from "../../../components/Avatar";

export default function AdminStaffDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: staff, isLoading, isError } = useGetStaffByIdQuery(id || "");

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-canceld">
        <p className="text-xl font-bold">Personel bulunamadı.</p>
        <Link
          to="/admin/staff"
          className="mt-4 inline-block text-deep hover:underline"
        >
          Personel Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wide">
      <Breadcrumb items={[
        { label: "Personel", to: "/admin/staff" },
        { label: `${staff.person.name} ${staff.person.surname}` },
      ]} />

      <div className="card-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 bg-deep/10 border-b border-deep/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                name={staff.person.name}
                surname={staff.person.surname}
                size="lg"
              />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-main break-words text-balance">
                  {staff.person.name} {staff.person.surname}
                </h1>
                <p className="text-deep font-semibold">
                  {staff.job_title}
                </p>
              </div>
            </div>
            <Link
              to={`/admin/staff/${staff.id}/edit`}
              className="px-5 py-2.5 text-sm font-medium text-waiting bg-surface border border-waiting/20 rounded-lg hover:bg-waiting/10 shadow-sm"
            >
              Bilgileri Düzenle
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <h2 className="section-header">
              İletişim Bilgileri
            </h2>
            <div className="flex items-center gap-4 bg-back p-4 rounded-xl">
              <div className="icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="detail-label">
                  İş E-Posta (Giriş)
                </p>
                <p className="detail-value break-words">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-back p-4 rounded-xl">
              <div className="icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="detail-label">Telefon</p>
                <p className="detail-value break-words">
                  {staff.person.phone_number}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="section-header">
              Sistem Bilgileri
            </h2>
            <div className="bg-back p-4 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-main/60">Kategori:</span>
                <span className="font-medium text-main">
                  {staff.category?.name ?? "Atanmamış"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-main/60">Kayıt Tarihi:</span>
                <span className="font-medium text-main">
                  {new Date(
                    staff.created_at.split("T")[0] + "T00:00:00",
                  ).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {staff.managing_admin && (
                <div className="flex justify-between">
                  <span className="text-main/60">Yöneticisi:</span>
                  <span className="font-medium text-main">
                    {staff.managing_admin.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams, Link } from "react-router";
import { useGetServiceByIdQuery } from "../../../hooks/useServiceQueries";
import Breadcrumb from "../../../components/Breadcrumb";
import { formatDate } from "../../../utils/dates";

export default function AdminServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceByIdQuery(id || "");

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-canceld">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link
          to="/admin/services"
          className="mt-4 inline-block text-deep hover:underline"
        >
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wide">
      <Breadcrumb items={[
        { label: "Hizmetler", to: "/admin/services" },
        { label: service.name },
      ]} />

      <div className="card-lg p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-main/5 pb-6">
          <div>
            {service.category && (
              <span className="badge badge-completed mb-4">
                {service.category.name}
              </span>
            )}
            <h1 className="page-header">
              {service.name}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/admin/services/${service.id}/edit`}
              className="btn-secondary"
            >
              Düzenle
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 bg-back p-6 rounded-xl">
            <div className="icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="detail-label">Süre</p>
              <p className="text-xl sm:text-2xl font-bold text-main">
                {service.duration}{" "}
                <span className="text-base font-normal text-main/60">
                  Dakika
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-back p-6 rounded-xl">
            <div className="icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="detail-label">Oluşturulma Tarihi</p>
              <p className="detail-value">
                {formatDate(service.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

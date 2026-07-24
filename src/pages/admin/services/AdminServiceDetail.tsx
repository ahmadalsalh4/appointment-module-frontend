import { useParams, Link } from "react-router";
import { useGetServiceByIdQuery } from "../../../hooks/useServiceQueries";

export default function AdminServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceByIdQuery(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link
          to="/admin/services"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/admin/services" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Hizmetler
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{service.name}</span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div>
            {service.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-4">
                {service.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-wrap-balance">
              {service.name}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/admin/services/${service.id}/edit`}
              className="px-5 py-2.5 text-sm font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
            >
              Düzenle
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Süre</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {service.duration}{" "}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Dakika
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Oluşturulma Tarihi</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {new Date(
                  service.created_at.split("T")[0] + "T00:00:00",
                ).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

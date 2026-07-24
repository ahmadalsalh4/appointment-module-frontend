import { Link } from "react-router";
import { useGetAllServicesQuery } from "../../hooks/useServiceQueries";
import type { ServiceWithCategory } from "../../other/types";

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useGetAllServicesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
          <p className="font-semibold text-lg">
            Hizmetler yüklenirken bir hata oluştu.
          </p>
          <p className="text-sm mt-1">
            Lütfen internet bağlantınızı kontrol edip tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight text-wrap-balance">
          Hizmetlerimiz
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          İhtiyacınıza uygun hizmeti seçin ve hemen randevunuzu oluşturun.
        </p>
      </div>

      {/* Grid Section */}
      {services && services.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            Şu anda aktif bir hizmet bulunmamaktadır.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: ServiceWithCategory) => (
            <Link
              to={`/services/${service.id}`}
              key={service.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col"
            >
              {/* Decorative top gradient bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Category Tag */}
              {service.category && (
                <span className="self-start inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-6">
                  {service.category.name}
                </span>
              )}

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3">
                {service.name}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 grow">
                Bu hizmet hakkında detaylı bilgi almak ve müsait saatleri görmek
                için tıklayın.
              </p>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
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
                  <span className="text-sm font-semibold">
                    {service.duration} dk
                  </span>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

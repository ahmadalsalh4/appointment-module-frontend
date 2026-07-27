import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useGetAllServicesQuery } from "../../hooks/useServiceQueries";
import type { ServiceWithCategory } from "../../other/types";
import PageHeader from "../../components/PageHeader";
import QueryGate from "../../components/QueryGate";
import EmptyState from "../../components/EmptyState";

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useGetAllServicesQuery();

  return (
    <div className="page-xl">
      <div className="text-center mb-12">
        <PageHeader
          title="Hizmetlerimiz"
          subtitle="İhtiyacınıza uygun hizmeti seçin ve hemen randevunuzu oluşturun."
        />
      </div>

      <QueryGate isLoading={isLoading} isError={isError} errorMessage="Hizmetler yüklenirken bir hata oluştu.">
      {/* Grid Section */}
      {services && services.length === 0 ? (
        <EmptyState message="Şu anda aktif bir hizmet bulunmamaktadır." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: ServiceWithCategory) => (
            <Link
              to={`/services/${service.id}`}
              key={service.id}
              className="group relative bg-surface rounded-2xl shadow-sm border border-main/5 p-6 lg:p-8 hover:shadow-xl hover:border-deep/20 transition-all duration-300 flex flex-col"
            >
              {/* Decorative top gradient bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-deep to-deep/40 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Category Tag */}
              {service.category && (
                <span className="self-start inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-deep/10 text-deep uppercase tracking-wide mb-6">
                  {service.category.name}
                </span>
              )}

              {/* Content */}
              <h3 className="text-xl font-bold text-main group-hover:text-deep transition-colors mb-3">
                {service.name}
              </h3>

              <p className="text-main/60 text-sm mb-6 grow">
                Bu hizmet hakkında detaylı bilgi almak ve müsait saatleri görmek
                için tıklayın.
              </p>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-main/5 mt-auto">
                <div className="flex items-center text-main/70">
                  <Clock className="h-5 w-5 mr-2 text-deep" />
                  <span className="text-sm font-semibold">
                    {service.duration} dk
                  </span>
                </div>

                <ArrowRight className="h-5 w-5 text-main/20 group-hover:text-deep group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
      </QueryGate>
    </div>
  );
}

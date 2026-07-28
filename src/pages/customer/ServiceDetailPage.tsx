import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useGetServiceByIdQuery } from "../../hooks/useServiceQueries";
import { useGetServiceStaffQuery } from "../../hooks/useServiceQueries";
import { useGetCategoryStaffQuery } from "../../hooks/useCategoryQueries";

import { useAuth } from "../../contexts/auth/useAuth";
import Breadcrumb from "../../components/Breadcrumb";
import QueryGate from "../../components/QueryGate";
import Avatar from "../../components/Avatar";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { data: service, isLoading, isError } = useGetServiceByIdQuery(id || "");

  const { data: serviceStaff } = useGetServiceStaffQuery(id || "");
  const { data: categoryStaff } = useGetCategoryStaffQuery(
    service?.category?.id || "",
  );

  const staffList =
    serviceStaff && serviceStaff.length > 0
      ? serviceStaff
      : categoryStaff ?? [];

  if (isError || !service) {
    return (
      <div className="page-xl text-center text-canceld">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link to="/services" className="mt-4 inline-block text-deep hover:underline">
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
      <div className="page-xl">
        <Breadcrumb
          items={[
            { label: "Hizmetler", to: "/services" },
            { label: service.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="card-lg p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
              {service.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-deep/10 text-deep uppercase tracking-wide mb-6">
                  {service.category.name}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-main mb-4 text-balance">
                {service.name}
              </h1>

              <div className="flex items-center text-main/80 bg-back rounded-lg p-4 mb-6">
                <Clock className="h-6 w-6 mr-3 text-deep" />
                <div>
                  <p className="text-xs text-main/60 uppercase font-semibold">Süre</p>
                  <p className="text-lg font-bold">{service.duration} Dakika</p>
                </div>
              </div>

              <p className="text-main/70 leading-relaxed mb-6">
                Bu hizmeti almak için randevu oluşturabilirsiniz. Devam ettiğinizde adım adım
                personel, tarih ve saat seçimi yapabileceğiniz bir sihirbaz açılacak.
              </p>

              <Link
                to="/services"
                className="inline-flex items-center text-sm font-semibold text-deep hover:text-deep/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Tüm Hizmetlere Dön
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="card-lg p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-deep" />
                <h2 className="text-2xl font-bold text-main">Randevu Oluştur</h2>
              </div>
              <p className="text-main/70 mb-6">
                Aşağıdaki butona tıklayarak personel, tarih ve saat seçimi yapabileceğiniz
                randevu sihirbazını açabilirsiniz.
              </p>
              {!token ? (
                <div className="text-center py-10 bg-back rounded-xl border border-main/10">
                  <User className="mx-auto h-12 w-12 text-main/15 mb-3" strokeWidth={1} />
                  <h3 className="text-lg font-bold text-main mb-2">
                    Randevu oluşturmak için giriş yapın
                  </h3>
                  <p className="text-main/60 mb-4 text-sm">
                    Hizmet detaylarını görüntüleyebilirsiniz, ancak randevu almak için
                    üye girişi yapmalısınız.
                  </p>
                  <Link to="/login" className="btn-primary">
                    Giriş Yap
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/appointments/new/${id}`)}
                  className="btn-primary w-full sm:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  Randevu Oluştur
                </button>
              )}
            </div>

            {staffList.length > 0 && (
              <div className="card-lg p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg font-bold text-main mb-4">
                  Bu Hizmeti Verebilen Personel
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staffList.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 bg-back rounded-xl"
                    >
                      <Avatar name={s.person.name} surname={s.person.surname} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-main truncate">
                          {s.person.name} {s.person.surname}
                        </p>
                        <p className="text-xs text-main/60 truncate">{s.job_title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </QueryGate>
  );
}

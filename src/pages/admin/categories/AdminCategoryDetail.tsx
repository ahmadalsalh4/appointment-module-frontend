import { useParams, Link } from "react-router";
import { Clock, List } from "lucide-react";
import { useGetCategoryByIdQuery } from "../../../hooks/useCategoryQueries";
import Breadcrumb from "../../../components/Breadcrumb";
import QueryGate from "../../../components/QueryGate";

export default function AdminCategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    data: category,
    isLoading,
    isError,
  } = useGetCategoryByIdQuery(id || "");

  if (isError || !category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-canceld">
        <p className="text-xl font-bold">Kategori bulunamadı.</p>
        <Link
          to="/admin/categories"
          className="mt-4 inline-block text-deep hover:underline"
        >
          Kategorilere Dön
        </Link>
      </div>
    );
  }

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
    <div className="page-wide">
      <Breadcrumb items={[
        { label: "Kategoriler", to: "/admin/categories" },
        { label: category.name },
      ]} />

      <div className="card-lg p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-main/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="icon-box">
              <List className="h-8 w-8" />
            </div>
            <h1 className="page-header">
              {category.name}
            </h1>
          </div>
          <Link
            to={`/admin/categories/${category.id}/edit`}
            className="btn-secondary"
          >
            Düzenle
          </Link>
        </div>

        {/* Altındaki Hizmetler */}
        <div>
          <h2 className="section-header">
            Bu Kategoriye Ait Hizmetler
          </h2>
          {category.services && category.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-back rounded-lg border border-main/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-main">
                      {service.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-main/60">
                    <Clock className="h-4 w-4" />
                    {service.duration} dk
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-main/60 text-center py-8 bg-back rounded-lg">
              Bu kategoriye ait henüz bir hizmet eklenmemiş.
            </p>
          )}
        </div>
      </div>
    </div>
    </QueryGate>
  );
}

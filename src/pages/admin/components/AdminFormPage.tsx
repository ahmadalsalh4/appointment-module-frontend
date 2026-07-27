import type { ReactNode, FormEvent } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import FormActions from "../../../components/FormActions";
import type { BreadcrumbItem } from "../../../components/Breadcrumb";
import QueryGate from "../../../components/QueryGate";

interface AdminFormPageProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  cancelTo: string;
  isPending: boolean;
  submitLabel?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
}

export default function AdminFormPage({
  title,
  breadcrumbs,
  cancelTo,
  isPending,
  submitLabel = "Kaydet",
  isLoading = false,
  isError = false,
  errorMessage = "",
  children,
  onSubmit,
}: AdminFormPageProps) {
  return (
    <QueryGate isLoading={isLoading} isError={isError} errorMessage={errorMessage}>
      <div className="page">
        <Breadcrumb items={breadcrumbs} />
        <div className="card-lg p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-main mb-6 text-balance">
            {title}
          </h1>
          <form onSubmit={onSubmit} className="section-gap-sm">
            {children}
            <FormActions
              cancelTo={cancelTo}
              isPending={isPending}
              submitLabel={submitLabel}
            />
          </form>
        </div>
      </div>
    </QueryGate>
  );
}

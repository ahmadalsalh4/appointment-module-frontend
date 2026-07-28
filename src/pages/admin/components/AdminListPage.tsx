import { Link } from "react-router";
import type { ReactNode } from "react";
import PageHeader from "../../../components/PageHeader";
import QueryGate from "../../../components/QueryGate";
import SortableTh from "../../../components/SortableTh";
import { SkeletonTable } from "../../../components/skeletons/SkeletonTableRow";

export interface AdminListColumn {
  header: string;
  className?: string;
  sortField?: string;
  align?: "left" | "right" | "center";
}

interface AdminListPageProps {
  title: string;
  subtitle: string;
  addPath: string;
  addLabel: string;
  columns: AdminListColumn[];
  itemsCount: number;
  emptyMessage: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  loading?: ReactNode;
  toolbar?: ReactNode;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  children: ReactNode;
}

export default function AdminListPage({
  title,
  subtitle,
  addPath,
  addLabel,
  columns,
  itemsCount,
  emptyMessage,
  isLoading,
  isError,
  errorMessage,
  loading,
  toolbar,
  sortBy,
  sortOrder,
  onSort,
  children,
}: AdminListPageProps) {
  return (
    <div className="page-xl space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Link to={addPath} className="btn-primary">
            {addLabel}
          </Link>
        }
      />

      {toolbar}

      <QueryGate
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        loading={loading ?? <SkeletonTable rows={8} columns={columns.length} />}
      >
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-main/10">
              <thead className="bg-back">
                <tr>
                  {columns.map((col, i) => {
                    if (col.sortField && onSort) {
                      return (
                        <SortableTh
                          key={i}
                          field={col.sortField}
                          currentField={sortBy}
                          currentOrder={sortOrder}
                          onSort={onSort}
                          className={col.className ?? ""}
                          align={col.align ?? "left"}
                        >
                          {col.header}
                        </SortableTh>
                      );
                    }
                    return (
                      <th
                        key={i}
                        scope="col"
                        className={
                          col.className ??
                          "px-3 sm:px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                        }
                      >
                        {col.header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-main/5">
                {itemsCount > 0 ? (
                  children
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-main/60"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </QueryGate>
    </div>
  );
}

import { Skeleton } from "./Skeleton";

interface SkeletonTableRowProps {
  columns?: number;
}

export default function SkeletonTableRow({ columns = 5 }: SkeletonTableRowProps) {
  return (
    <tr className="border-b border-main/5">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-3 sm:px-6 py-3 sm:py-4">
          <Skeleton className={`h-4 ${i === 0 ? "w-32" : i === columns - 1 ? "w-16 ml-auto" : "w-24"}`} />
          {i === 1 && <Skeleton className="h-3 w-14 mt-1.5" />}
        </td>
      ))}
    </tr>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 6, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-main/10">
          <thead className="bg-back">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-3 sm:px-6 py-3 text-left">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface">
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { Skeleton, SkeletonText } from "./Skeleton";

interface SkeletonCardProps {
  showCategory?: boolean;
}

export default function SkeletonCard({ showCategory = true }: SkeletonCardProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-main/5 p-6 lg:p-8 flex flex-col">
      <div className="absolute inset-x-0 top-0 h-1 bg-main/5 rounded-t-2xl" />
      {showCategory && <Skeleton className="h-5 w-20 mb-6" />}
      <Skeleton className="h-5 w-3/4 mb-3" />
      <div className="space-y-2 mb-6 grow">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-main/5 mt-auto">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

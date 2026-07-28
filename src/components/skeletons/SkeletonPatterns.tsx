import { Skeleton, SkeletonText } from "./Skeleton";

export function SkeletonStatCard() {
  return (
    <div className="card p-6 flex items-center gap-4">
      <Skeleton className="h-14 w-14 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function SkeletonAppointmentCard() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-xl shrink-0 hidden sm:block" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-4 w-2/3" />
          <SkeletonText className="w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonAppointmentCardList({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonAppointmentCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStaffCard() {
  return (
    <div className="card p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="pt-4 border-t border-main/5 flex justify-end gap-4">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-6" />
      </div>
    </div>
  );
}

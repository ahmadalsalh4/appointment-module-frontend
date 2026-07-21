interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Yükleniyor..." }: LoadingProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-back p-6">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface border-t-deep"></div>

      <p className="text-lg font-medium text-main">{message}</p>
    </div>
  );
}

export function InlineLoading() {
  return (
    <div className="flex items-center gap-2 text-waiting">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-surface border-t-waiting"></div>
      <span className="text-sm font-medium">İşleniyor...</span>
    </div>
  );
}

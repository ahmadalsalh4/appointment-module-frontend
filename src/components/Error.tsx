interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({
  message = "Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.",
  onRetry,
}: ErrorProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 bg-back p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-canceld/10">
        <svg
          className="h-10 w-10 text-canceld"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="mb-2 text-xl font-bold text-main">Hata Oluştu</h3>
        <p className="text-sm leading-relaxed text-main/70">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg bg-deep px-6 py-2.5 text-sm font-semibold text-surface shadow-md transition-all hover:bg-deep/90 hover:shadow-lg active:scale-95"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}

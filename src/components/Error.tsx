interface ErrorProps {
  message?: string;
}

export default function Error({
  message = "Bir şeyler ters gitti.",
}: ErrorProps) {
  if (!message) return null;

  return (
    <div className="border-l-4 border-canceld py-2 pl-3">
      <p className="text-sm font-medium text-canceld">{message}</p>
    </div>
  );
}

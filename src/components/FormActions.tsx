import { Link } from "react-router";

interface FormActionsProps {
  cancelTo: string;
  isPending: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function FormActions({
  cancelTo,
  isPending,
  submitLabel = "Kaydet",
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4 pt-4 border-t border-main/5">
      {onCancel ? (
        <button type="button" onClick={onCancel} className="btn-secondary">
          İptal
        </button>
      ) : (
        <Link to={cancelTo} className="btn-secondary">
          İptal
        </Link>
      )}
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? (
          <>
            <span className="spinner-sm" />
            Kaydediliyor...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}

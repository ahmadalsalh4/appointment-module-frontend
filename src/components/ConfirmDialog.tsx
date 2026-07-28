import type { ReactNode } from "react";
import Modal from "./Modal";

export type ConfirmVariant = "danger" | "primary" | "success" | "warning";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isPending?: boolean;
}

const VARIANT_CLASSES: Record<ConfirmVariant, string> = {
  danger: "bg-canceld text-white hover:bg-canceld/90",
  primary: "bg-deep text-white hover:bg-deep/90",
  success: "bg-completed text-white hover:bg-completed/90",
  warning: "bg-waiting text-white hover:bg-waiting/90",
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  variant = "danger",
  isPending = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${VARIANT_CLASSES[variant]}`}
          >
            {isPending && <span className="spinner-sm" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      {description && (
        <div className="text-sm text-main/80 leading-relaxed">{description}</div>
      )}
    </Modal>
  );
}

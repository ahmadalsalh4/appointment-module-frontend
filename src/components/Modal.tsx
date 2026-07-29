import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActive = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Per-instance body-overflow guard. Previously module-scoped counters
  // meant a re-render with `closeOnEscape` flipping from true → false
  // would save "hidden" as the original overflow and permanently lock
  // body scroll after the modal closed.
  const savedBodyOverflow = useRef<string>("");

  // Keep the latest onClose in a ref so we can attach a stable
  // keydown listener that doesn't churn on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousActive.current = document.activeElement as HTMLElement | null;
    savedBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    // Defer focus to next paint so screen readers announce the dialog
    // before focus moves.
    const focusTimer = window.setTimeout(() => {
      getFocusable()?.[0]?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (first && e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (last && !e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = savedBodyOverflow.current;
      previousActive.current?.focus();
    };
  }, [open, closeOnEscape]);

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => closeOnBackdrop && onClose()}
      />
      <div
        ref={dialogRef}
        className={`relative w-full ${SIZE_CLASSES[size]} bg-surface rounded-2xl shadow-xl border border-main/10 flex flex-col max-h-[90vh]`}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-6 border-b border-main/10">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-lg sm:text-xl font-bold text-main text-balance">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="text-sm text-main/60 mt-1 text-balance">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-main/40 hover:text-main transition-colors p-1 -m-1 rounded-lg hover:bg-back focus:outline-none focus:ring-2 focus:ring-deep/30"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="p-4 sm:p-6 border-t border-main/10 bg-back/50 rounded-b-2xl flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
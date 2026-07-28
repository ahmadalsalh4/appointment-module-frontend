import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastItems, useToastTimer, type ToastVariant } from "../hooks/useToast";
import { useToast } from "../hooks/useToast";

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "bg-completed/10 border-completed/30 text-completed",
  error: "bg-canceld/10 border-canceld/30 text-canceld",
  info: "bg-deep/10 border-deep/30 text-deep",
  warning: "bg-waiting/10 border-waiting/30 text-waiting",
};

const VARIANT_ICONS: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function ToastHost() {
  useToastTimer();
  const items = useToastItems();
  const { dismiss } = useToast();
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-[min(calc(100vw-3rem),22rem)]">
      {items.map((item) => {
        const Icon = VARIANT_ICONS[item.variant];
        return (
          <div
            key={item.id}
            role="alert"
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm bg-surface/95 ${VARIANT_STYLES[item.variant]}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-main flex-1 break-words">
              {item.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="text-main/40 hover:text-main p-1 -m-1 rounded-lg hover:bg-back/50 shrink-0"
              aria-label="Bildirimi kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

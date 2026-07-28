import ConfirmDialog from "./ConfirmDialog";
import { closeConfirm, useConfirmState } from "../hooks/useConfirm";

export default function ConfirmHost() {
  const state = useConfirmState();
  if (!state.open) return null;
  return (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      description={state.description}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      variant={state.variant ?? "danger"}
      onClose={() => closeConfirm(false)}
      onConfirm={() => closeConfirm(true)}
    />
  );
}

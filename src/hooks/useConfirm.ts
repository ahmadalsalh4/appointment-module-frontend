import { create } from "./createStore";
import type { ConfirmVariant } from "../components/ConfirmDialog";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve: ((value: boolean) => void) | null;
}

const initialState: ConfirmState = {
  open: false,
  title: "",
  description: undefined,
  confirmLabel: undefined,
  cancelLabel: undefined,
  variant: "danger",
  resolve: null,
};

const [useConfirmStore, setConfirmStore, getConfirmState] = create<ConfirmState>(initialState);

export function useConfirm() {
  return (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmStore({
        ...initialState,
        ...options,
        open: true,
        resolve,
      });
    });
  };
}

export function useConfirmState() {
  return useConfirmStore();
}

export function closeConfirm(result: boolean) {
  const state = getConfirmState();
  state.resolve?.(result);
  setConfirmStore({ ...state, open: false, resolve: null });
}

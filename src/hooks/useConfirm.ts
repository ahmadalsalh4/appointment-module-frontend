import { useCallback } from "react";
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
}

interface PendingResolve {
  resolve: (value: boolean) => void;
}

const initialState: ConfirmState = {
  open: false,
  title: "",
  description: undefined,
  confirmLabel: undefined,
  cancelLabel: undefined,
  variant: "danger",
};

const [useConfirmStore, setConfirmStore] = create<ConfirmState>(initialState);

// Queue of pending resolves. Each new confirm() call enqueues its
// resolver; closeConfirm() drains the head of the queue. This prevents
// the previous "second confirm clobbers the first, first awaiter hangs
// forever" race.
const pending: PendingResolve[] = [];

const drainHead = (result: boolean) => {
  const head = pending.shift();
  if (head) head.resolve(result);
  // Use the functional updater so a concurrent closeConfirm/reset
  // can't lose our state.
  setConfirmStore((s) => ({ ...s, ...initialState, open: false }));
};

export function useConfirm() {
  // Wrap in useCallback so consumers passing it as a prop don't churn
  // memoised children on every render.
  return useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      pending.push({ resolve });
      setConfirmStore({
        ...initialState,
        ...options,
        open: true,
      });
    });
  }, []);
}

export function useConfirmState() {
  return useConfirmStore();
}

// Public API: resolves the head of the queue with the given boolean.
// If nothing is pending this is a no-op (defensive: dialogs can be
// closed via escape / backdrop without an explicit cancel call from
// the consumer).
export function closeConfirm(result: boolean) {
  if (pending.length === 0) {
    setConfirmStore((s) => ({ ...s, open: false }));
    return;
  }
  drainHead(result);
}
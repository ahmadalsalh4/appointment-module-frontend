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

// `resolve` is stored in a module-level queue rather than the React
// store state, because storing a function in a "state" object (one
// passed through useSyncExternalStore) breaks reference equality and
// forces every subscriber to re-render on every confirm.
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

const [useConfirmStore, setConfirmStore, getConfirmState] = create<ConfirmState>(initialState);

// Queue of pending resolves. Each new confirm() call enqueues its
// resolver; closeConfirm() drains the head of the queue. This prevents
// the previous "second confirm clobbers the first, first awaiter hangs
// forever" race.
const pending: PendingResolve[] = [];

const drainHead = (result: boolean) => {
  const head = pending.shift();
  if (head) head.resolve(result);
  setConfirmStore({ ...initialState, open: false });
};

export function useConfirm() {
  return (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      pending.push({ resolve });
      setConfirmStore({
        ...initialState,
        ...options,
        open: true,
      });
    });
  };
}

export function useConfirmState() {
  return useConfirmStore();
}

// Public API: resolves the head of the queue with the given boolean.
// If nothing is pending this is a no-op (defensive: dialogs can be
// closed via escape / backdrop without an explicit cancel call from
// the consumer).
export function closeConfirm(result: boolean) {
  // If no one is waiting, just close the dialog visually.
  if (pending.length === 0) {
    setConfirmStore({ ...getConfirmState(), open: false });
    return;
  }
  drainHead(result);
}

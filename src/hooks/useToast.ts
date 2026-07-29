import { create } from "./createStore";
import { useEffect, useRef } from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastInput {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends Required<ToastInput> {
  id: string;
}

interface ToastState {
  items: ToastItem[];
}

const initialState: ToastState = { items: [] };

const [useToastStore, setToastStore] = create<ToastState>(initialState);

// Monotonic counter used in the `crypto.randomUUID` fallback so two
// toasts pushed synchronously in the same millisecond get distinct IDs.
let monotonicFallback = 0;

const newId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  monotonicFallback += 1;
  return `toast-${Date.now()}-${monotonicFallback}`;
};

// Dedup policy: if the same `(variant, message)` already exists in the
// queue, return its existing id instead of stacking a duplicate.
function findDuplicate(items: ToastItem[], message: string, variant: ToastVariant): string | null {
  for (const i of items) {
    if (i.message === message && i.variant === variant) return i.id;
  }
  return null;
}

function push(input: ToastInput): string {
  const variant = input.variant ?? "info";
  const duration = input.duration ?? 4000;
  let dedupedId: string | null = null;
  setToastStore((s) => {
    dedupedId = findDuplicate(s.items, input.message, variant);
    if (dedupedId) return s;
    const id = newId();
    const item: ToastItem = { id, message: input.message, variant, duration };
    return { items: [...s.items, item] };
  });
  // We rely on setState being synchronous in this store; if it ever
  // becomes async this would need to be revisited.
  return dedupedId ?? "";
}

function dismiss(id: string) {
  setToastStore((s) => ({ items: s.items.filter((i) => i.id !== id) }));
}

export function useToast() {
  return {
    push: (input: ToastInput) => push(input),
    success: (message: string) => push({ message, variant: "success" }),
    error: (message: string) => push({ message, variant: "error", duration: 5000 }),
    info: (message: string) => push({ message, variant: "info" }),
    warning: (message: string) => push({ message, variant: "warning" }),
    dismiss,
  };
}

export function useToastItems() {
  return useToastStore((s) => s.items);
}

export function useToastTimer() {
  const items = useToastItems();
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Schedule dismissal for any new item that doesn't already have a timer.
  useEffect(() => {
    for (const item of items) {
      if (timers.current.has(item.id)) continue;
      const t = setTimeout(() => dismiss(item.id), item.duration);
      timers.current.set(item.id, t);
    }
  }, [items]);

  // Cancel timers for items that have been removed (e.g. manually
  // dismissed or replaced).
  useEffect(() => {
    const liveIds = new Set(items.map((i) => i.id));
    for (const [id, t] of [...timers.current]) {
      if (!liveIds.has(id)) {
        clearTimeout(t);
        timers.current.delete(id);
      }
    }
  }, [items]);

  // Final cleanup on unmount.
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);
}
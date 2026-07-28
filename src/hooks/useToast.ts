import { create } from "./createStore";
import { useEffect, useRef } from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastInput {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastInput, "duration">> {
  id: string;
  duration: number;
}

interface ToastState {
  items: ToastItem[];
}

const initialState: ToastState = { items: [] };

const [useToastStore, setToastStore] = create<ToastState>(initialState);

const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function push(input: ToastInput): string {
  const id = newId();
  const item: ToastItem = {
    id,
    message: input.message,
    variant: input.variant ?? "info",
    duration: input.duration ?? 4000,
  };
  setToastStore((s) => ({ items: [...s.items, item] }));
  return id;
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

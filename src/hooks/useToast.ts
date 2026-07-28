import { create } from "./createStore";
import { useEffect, useRef } from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastInput {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastInput, "duration">> {
  id: number;
  duration: number;
}

interface ToastState {
  items: ToastItem[];
}

const initialState: ToastState = { items: [] };

const [useToastStore, setToastStore] = create<ToastState>(initialState);

let nextId = 1;

function push(input: ToastInput): number {
  const id = nextId++;
  const item: ToastItem = {
    id,
    message: input.message,
    variant: input.variant ?? "info",
    duration: input.duration ?? 4000,
  };
  setToastStore((s) => ({ items: [...s.items, item] }));
  return id;
}

function dismiss(id: number) {
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
  const seenIds = useRef<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const currentIds = new Set(items.map((i) => i.id));

    for (const item of items) {
      if (seenIds.current.has(item.id)) continue;
      const timer = setTimeout(() => dismiss(item.id), item.duration);
      timers.current.set(item.id, timer);
      seenIds.current.add(item.id);
    }

    for (const id of [...seenIds.current]) {
      if (!currentIds.has(id)) {
        const t = timers.current.get(id);
        if (t) clearTimeout(t);
        timers.current.delete(id);
        seenIds.current.delete(id);
      }
    }
  }, [items]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);
}

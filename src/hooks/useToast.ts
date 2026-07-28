import { create } from "./createStore";
import { useEffect } from "react";

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

export function useToast() {
  return {
    push: (input: ToastInput) => {
      const id = nextId++;
      const item: ToastItem = {
        id,
        message: input.message,
        variant: input.variant ?? "info",
        duration: input.duration ?? 4000,
      };
      setToastStore((s) => ({ items: [...s.items, item] }));
      return id;
    },
    success: (message: string) => {
      const id = nextId++;
      setToastStore((s) => ({
        items: [...s.items, { id, message, variant: "success", duration: 4000 }],
      }));
      return id;
    },
    error: (message: string) => {
      const id = nextId++;
      setToastStore((s) => ({
        items: [...s.items, { id, message, variant: "error", duration: 5000 }],
      }));
      return id;
    },
    info: (message: string) => {
      const id = nextId++;
      setToastStore((s) => ({
        items: [...s.items, { id, message, variant: "info", duration: 4000 }],
      }));
      return id;
    },
    warning: (message: string) => {
      const id = nextId++;
      setToastStore((s) => ({
        items: [...s.items, { id, message, variant: "warning", duration: 4000 }],
      }));
      return id;
    },
    dismiss: (id: number) => {
      setToastStore((s) => ({ items: s.items.filter((i) => i.id !== id) }));
    },
  };
}

export function useToastItems() {
  return useToastStore((s) => s.items);
}

export function useToastTimer() {
  const items = useToastItems();
  const dismiss = useToast().dismiss;
  useEffect(() => {
    if (items.length === 0) return;
    const timers = items.map((item) =>
      setTimeout(() => dismiss(item.id), item.duration),
    );
    return () => timers.forEach(clearTimeout);
  }, [items, dismiss]);
}

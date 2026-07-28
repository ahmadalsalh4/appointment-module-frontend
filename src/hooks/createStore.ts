import { useSyncExternalStore } from "react";

type Updater<T> = (state: T) => T;

export function create<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const setState = (updater: T | Updater<T>) => {
    const next =
      typeof updater === "function"
        ? (updater as Updater<T>)(state)
        : updater;
    if (Object.is(next, state)) return;
    state = next;
    listeners.forEach((l) => l());
  };

  const getState = () => state;

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore<U = T>(selector: (s: T) => U = (s) => s as unknown as U): U {
    return useSyncExternalStore(
      subscribe,
      () => selector(getState()),
      () => selector(initial),
    );
  }

  return [useStore, setState, getState] as const;
}

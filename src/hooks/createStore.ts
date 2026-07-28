import { useCallback, useSyncExternalStore } from "react";

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
    return () => {
      listeners.delete(listener);
    };
  };

  function useStore(): T;
  function useStore<U>(selector: (s: T) => U): U;
  function useStore<U>(selector: (s: T) => U = (s) => s as unknown as U): U {
    const getSelected = useCallback(() => selector(getState()), [selector]);
    const getServerSelected = useCallback(() => selector(initial), [selector]);
    return useSyncExternalStore(subscribe, getSelected, getServerSelected);
  }

  return [useStore, setState, getState] as const;
}

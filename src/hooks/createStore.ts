import { useCallback, useMemo, useSyncExternalStore } from "react";

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
  function useStore<U>(selector?: (s: T) => U): U | T {
    // Memoise the defaulted selector so the underlying useCallback deps
    // don't churn on every render. Consumers who pass a fresh selector
    // each render will still trigger churn here, but consumers who
    // don't pass one won't.
    const sel = useMemo(
      () => selector ?? ((s: T) => s as unknown as T & U),
      [selector],
    );
    const getSelected = useCallback(() => sel(getState()), [sel]);
    const getServerSelected = useCallback(() => sel(initial), [sel]);
    return useSyncExternalStore(subscribe, getSelected, getServerSelected);
  }

  return [useStore, setState, getState] as const;
}
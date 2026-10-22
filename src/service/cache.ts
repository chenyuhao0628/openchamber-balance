import type { BalancesResult, Provider } from '../shared/types.ts';

/** Explicit-refresh cache. A configuration write invalidates in-flight snapshots too. */
export const createBalanceCache = (load: (previous: Provider[]) => Promise<BalancesResult>) => {
  let cached: BalancesResult | null = null;
  let previous: Provider[] = [];
  let revision = 0;
  let pending: { revision: number; promise: Promise<BalancesResult> } | null = null;

  const get = async (force = false): Promise<BalancesResult> => {
    const started = revision;
    if (!force && cached) return cached;
    if (!pending || pending.revision !== started) {
      const promise = load(previous).then((result) => {
        if (revision === started) {
          cached = result;
          previous = result.providers;
        }
        return result;
      });
      pending = { revision: started, promise };
      void promise.finally(() => {
        if (pending?.promise === promise) pending = null;
      }).catch(() => undefined);
    }
    try {
      const result = await pending.promise;
      // A response started before a save/delete must never resurrect an old relay.
      return revision === started ? result : get();
    } catch (error) {
      if (revision !== started) return get();
      throw error;
    }
  };

  const invalidate = (providerId: string): void => {
    revision += 1;
    cached = null;
    previous = previous.filter((provider) => provider.id !== providerId);
  };
  return { get, invalidate };
};

export const failedProvider = (id: string, name: string, error: string, previous?: Provider): Provider => ({
  id, name, ok: false,
  plan: previous?.plan ?? null,
  balance: previous?.balance ?? null,
  detail: previous?.detail ?? null,
  windows: previous?.windows ?? [],
  updatedAt: previous?.updatedAt ?? null,
  stale: previous?.updatedAt != null,
  error,
});

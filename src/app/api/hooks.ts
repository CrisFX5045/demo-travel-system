import { useEffect, useRef, useState } from "react";
import type { SetStateAction } from "react";

type ApiState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isRefreshing: boolean;
};

const inFlightRequests = new Map<string, Promise<unknown>>();
const recentResponses = new Map<
  string,
  {
    data: unknown;
    expiresAt: number;
  }
>();

const SHARED_REQUEST_CACHE_MS = 1000;

export function clearApiResourceCache(requestKeyPrefix?: string) {
  if (!requestKeyPrefix) {
    inFlightRequests.clear();
    recentResponses.clear();
    return;
  }

  for (const key of inFlightRequests.keys()) {
    if (key.startsWith(requestKeyPrefix)) inFlightRequests.delete(key);
  }

  for (const key of recentResponses.keys()) {
    if (key.startsWith(requestKeyPrefix)) recentResponses.delete(key);
  }
}

export function useApiResource<T>(
  loader: () => Promise<T>,
  deps: readonly unknown[] = [],
  options: {
    enabled?: boolean;
    initialData?: T | null;
    requestKey?: string;
  } = {},
) {
  const [state, setState] = useState<ApiState<T>>({
    data: options.initialData ?? null,
    error: null,
    isLoading: options.enabled === false ? false : options.initialData == null,
    isRefreshing: false,
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (options.enabled === false) {
      setState((current) => ({
        ...current,
        data: options.initialData ?? current.data,
        isLoading: false,
        isRefreshing: false,
      }));
      return;
    }

    let isMounted = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setState((current) => ({
      ...current,
      isLoading: current.data === null,
      isRefreshing: current.data !== null,
      error: null,
    }));

    const request = options.requestKey
      ? getSharedRequest(options.requestKey, loader)
      : loader();

    request
      .then((data) => {
        if (!isMounted || requestId !== requestIdRef.current) return;

        setState({
          data,
          error: null,
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch((error) => {
        if (!isMounted || requestId !== requestIdRef.current) return;

        setState((current) => ({
          data: current.data,
          error: error instanceof Error ? error : new Error(String(error)),
          isLoading: false,
          isRefreshing: false,
        }));
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, options.enabled, options.requestKey]);

  return {
    ...state,
    setData: (updater: SetStateAction<T | null>) => {
      setState((current) => ({
        ...current,
        data: updater instanceof Function ? updater(current.data) : updater,
      }));
    },
  };
}

function getSharedRequest<T>(key: string, loader: () => Promise<T>) {
  const recentResponse = recentResponses.get(key);
  if (recentResponse && recentResponse.expiresAt > Date.now()) {
    return Promise.resolve(recentResponse.data as T);
  }

  const existingRequest = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existingRequest) return existingRequest;

  const request = loader()
    .then((data) => {
      recentResponses.set(key, {
        data,
        expiresAt: Date.now() + SHARED_REQUEST_CACHE_MS,
      });
      return data;
    })
    .finally(() => {
      if (inFlightRequests.get(key) === request) {
        inFlightRequests.delete(key);
      }
    });

  inFlightRequests.set(key, request);
  return request;
}

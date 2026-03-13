type LoadingListener = (isLoading: boolean) => void;

let pendingRequests = 0;
const listeners = new Set<LoadingListener>();

function notifyListeners() {
  const isLoading = pendingRequests > 0;

  listeners.forEach((listener) => listener(isLoading));
}

export function beginRequestLoading() {
  pendingRequests += 1;
  notifyListeners();
}

export function endRequestLoading() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  notifyListeners();
}

export function subscribeRequestLoading(listener: LoadingListener): () => void {
  listeners.add(listener);
  listener(pendingRequests > 0);

  return () => {
    listeners.delete(listener);
  };
}

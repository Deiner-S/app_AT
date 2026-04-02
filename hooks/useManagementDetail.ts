import {
  type ManagementDetailResource,
  loadManagementDetail,
  toggleManagementStatus,
} from '@/services/managementService';
import { useCallback, useEffect, useState } from 'react';

export default function useManagementDetail<T>(
  resource: ManagementDetailResource,
  identifier: string | undefined
) {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (isRefresh = false) => {
    if (!identifier) {
      setError('Identificador invalido.');
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const response = await loadManagementDetail(resource, identifier);
      setItem(response as T);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar os dados.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [identifier, resource]);

  const toggleStatus = useCallback(async () => {
    if (!identifier) {
      throw new Error('Identificador invalido.');
    }

    try {
      setActionLoading(true);
      await toggleManagementStatus(resource, identifier);
      await reload(true);
    } finally {
      setActionLoading(false);
    }
  }, [identifier, reload, resource]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    item,
    loading,
    refreshing,
    actionLoading,
    error,
    reload,
    setItem,
    toggleStatus,
  };
}

import {
  type ManagementListResource,
  loadManagementList,
} from '@/services/managementService';
import { useCallback, useEffect, useState } from 'react';

export default function useManagementList<T>(resource: ManagementListResource) {
  const [items, setItems] = useState<T[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (query = searchQuery, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const response = await loadManagementList(resource, query);
      setItems(response as T[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar os dados.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [resource, searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      reload(searchQuery);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [reload, searchQuery]);

  return {
    items,
    searchQuery,
    setSearchQuery,
    loading,
    refreshing,
    error,
    reload,
  };
}

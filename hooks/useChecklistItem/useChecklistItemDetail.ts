import { executeControllerTask } from '@/services/controllerErrorService';
import { checklistItemService } from '@/services/checklistItemService';
import type { ChecklistItemDetail } from '@/types/management';
import { useCallback, useEffect, useState } from 'react';

export default function useChecklistItemDetail(itemId: string | undefined) {
  const [item, setItem] = useState<ChecklistItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (isRefresh = false) => {
    if (!itemId) {
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
      const response = await checklistItemService.fetchChecklistItemDetail(itemId);
      setItem(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar os dados.';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [itemId]);

  const toggleStatus = useCallback(async () => {
    if (!itemId) {
      setError('Identificador invalido.');
      return false;
    }

    setActionLoading(true);

    try {
      const updated = await executeControllerTask(async () => {
        await checklistItemService.toggleChecklistItemStatus(itemId);
        await reload(true);
        return true;
      }, {
        operation: 'alterar status de item de checklist',
        fallbackValue: false,
      });

      return Boolean(updated);
    } finally {
      setActionLoading(false);
    }
  }, [itemId, reload]);

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

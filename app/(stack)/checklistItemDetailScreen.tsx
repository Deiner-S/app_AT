import AppShell from '@/components/appShell/AppShell';
import { DetailRow, DetailSection } from '@/components/management/Cards';
import useManagementDetail from '@/hooks/useManagementDetail';
import { executeControllerTask } from '@/services/controllerErrorService';
import type { ChecklistItemDetail } from '@/types/management';
import { formatDateLabel } from '@/utils/managementUi';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function ChecklistItemDetailScreen() {
  const params = useLocalSearchParams<{ itemId?: string }>();
  const { item, loading, error, actionLoading, toggleStatus } = useManagementDetail<ChecklistItemDetail>('checklistItem', params.itemId);
  const canToggleStatus = item?.permissions.canToggleStatus ?? false;

  async function handleToggleStatus() {
    if (!params.itemId || !canToggleStatus) {
      return;
    }

    await executeControllerTask(toggleStatus, {
      operation: 'alterar status de item de checklist',
    });
  }

  return (
    <AppShell title={item?.name ?? 'Item de checklist'} subtitle="Detalhes do item">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {item ? (
        <>
          {canToggleStatus ? (
            <Pressable style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]} onPress={handleToggleStatus} disabled={actionLoading}>
              <Text style={styles.actionButtonText}>
                {actionLoading
                  ? 'Atualizando...'
                  : item.status === 1
                    ? 'Desativar item'
                    : 'Reativar item'}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.helperText}>O sistema web nao liberou alteracao deste item para o token atual.</Text>
          )}

          <DetailSection title="Cadastro">
            <DetailRow label="Nome" value={item.name} />
            <DetailRow label="Status" value={item.statusLabel} />
            <DetailRow label="Uso em checklist" value={String(item.usageCount)} />
            <DetailRow label="Criado em" value={formatDateLabel(item.insertDate)} />
          </DetailSection>
        </>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 24,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0f766e',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  actionButtonDisabled: {
    opacity: 0.65,
  },
  helperText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
});

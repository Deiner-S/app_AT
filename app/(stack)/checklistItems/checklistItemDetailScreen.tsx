import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailRow, DetailSection } from '@/components/management/Cards';
import { useChecklistItemDetail } from '@/hooks/useChecklistItem';
import { formatDateLabel } from '@/utils/managementUi';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ChecklistItemDetailScreen() {
  const params = useLocalSearchParams<{ itemId?: string }>();
  const { item, loading, error, actionLoading, deleting, toggleStatus, deleteItem } = useChecklistItemDetail(params.itemId);
  const canToggleStatus = item?.permissions.canToggleStatus ?? false;
  const canDeleteChecklistItem = item?.permissions.canDeleteChecklistItem ?? false;

  async function handleToggleStatus() {
    if (!params.itemId || !canToggleStatus) {
      return;
    }

    await toggleStatus();
  }

  function handleDelete() {
    if (!params.itemId || !canDeleteChecklistItem) {
      return;
    }

    Alert.alert(
      'Excluir item',
      'Deseja excluir este item de checklist?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const removed = await deleteItem();

            if (removed) {
              router.replace(`/(stack)/${Routes.CHECKLIST_ITEMS}` as never);
            }
          },
        },
      ]
    );
  }

  return (
    <AppShell title={item?.name ?? 'Item de checklist'} subtitle="Detalhes do item">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {item ? (
        <>
          {canToggleStatus || canDeleteChecklistItem ? (
            <View style={styles.actionsRow}>
              {canToggleStatus ? (
                <Pressable style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]} onPress={handleToggleStatus} disabled={actionLoading || deleting}>
                  <Text style={styles.actionButtonText}>
                    {actionLoading
                      ? 'Atualizando...'
                      : item.status === 1
                        ? 'Desativar item'
                        : 'Reativar item'}
                  </Text>
                </Pressable>
              ) : null}

              {canDeleteChecklistItem ? (
                <Pressable style={[styles.deleteButton, deleting && styles.actionButtonDisabled]} onPress={handleDelete} disabled={deleting || actionLoading}>
                  <Text style={styles.deleteButtonText}>
                    {deleting ? 'Excluindo...' : 'Excluir item'}
                  </Text>
                </Pressable>
              ) : null}
            </View>
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
  actionsRow: {
    gap: 10,
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
  deleteButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.45)',
    backgroundColor: 'rgba(127, 29, 29, 0.18)',
  },
  deleteButtonText: {
    color: '#fecaca',
    fontWeight: '700',
  },
  helperText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
});

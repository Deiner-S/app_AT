import AppShell from '@/components/appShell/AppShell';
import { DetailRow, DetailSection, EmptyState, RecordCard } from '@/components/management/Cards';
import useManagementDetail from '@/hooks/useManagementDetail';
import { executeControllerTask } from '@/services/controllerErrorService';
import type { EmployeeDetail } from '@/types/management';
import { formatDateLabel, getBooleanLabel } from '@/utils/managementUi';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function EmployeeDetailScreen() {
  const params = useLocalSearchParams<{ employeeId?: string }>();
  const { item, loading, error, actionLoading, toggleStatus } = useManagementDetail<EmployeeDetail>('employee', params.employeeId);
  const canToggleStatus = item?.permissions.canToggleStatus ?? false;

  async function handleToggleStatus() {
    if (!params.employeeId || !canToggleStatus) {
      return;
    }

    await executeControllerTask(toggleStatus, {
      operation: 'alterar status de funcionario',
    });
  }

  return (
    <AppShell title={item?.fullName ?? 'Funcionario'} subtitle="Detalhes do cadastro">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {item ? (
        <>
          {canToggleStatus ? (
            <Pressable style={[styles.actionButton, actionLoading && styles.actionButtonDisabled]} onPress={handleToggleStatus} disabled={actionLoading}>
              <Text style={styles.actionButtonText}>
                {actionLoading
                  ? 'Atualizando...'
                  : item.isActive
                    ? 'Desativar funcionario'
                    : 'Reativar funcionario'}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.helperText}>O sistema web nao liberou alteracao de status para este funcionario.</Text>
          )}

          <DetailSection title="Cadastro">
            <DetailRow label="Nome" value={item.fullName} />
            <DetailRow label="Usuario" value={item.username} />
            <DetailRow label="Cargo" value={item.positionLabel} />
            <DetailRow label="Email" value={item.email} />
            <DetailRow label="Telefone" value={item.phone} />
            <DetailRow label="CPF" value={item.cpf} />
            <DetailRow label="Status" value={getBooleanLabel(item.isActive, 'Ativo', 'Inativo')} />
            <DetailRow label="Criado em" value={formatDateLabel(item.insertDate)} />
          </DetailSection>

          <DetailSection title="Enderecos">
            {item.addresses.length ? item.addresses.map((address) => (
              <RecordCard key={address.id} title={address.label} />
            )) : <EmptyState message="Funcionario sem enderecos cadastrados." />}
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

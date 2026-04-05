import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailRow, DetailSection, EmptyState, RecordCard } from '@/components/management/Cards';
import { useEmployeeDetail } from '@/hooks/useEmployee';
import { formatDateLabel, getBooleanLabel } from '@/utils/managementUi';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function EmployeeDetailScreen() {
  const params = useLocalSearchParams<{ employeeId?: string }>();
  const { item, loading, error, actionLoading, removingAddressId, toggleStatus, removeAddress } = useEmployeeDetail(params.employeeId);
  const permissions = item?.permissions;
  const canToggleStatus = permissions?.canToggleStatus ?? false;
  const canEditEmployee = permissions?.canEditEmployee ?? false;
  const canManageAddresses = permissions?.canManageAddresses ?? false;

  async function handleToggleStatus() {
    if (!params.employeeId || !canToggleStatus) {
      return;
    }

    await toggleStatus();
  }

  function handleRemoveAddress(addressId: string) {
    if (!canManageAddresses) {
      return;
    }

    Alert.alert(
      'Remover endereco',
      'Deseja remover este endereco do funcionario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            void removeAddress(addressId);
          },
        },
      ]
    );
  }

  return (
    <AppShell title={item?.fullName ?? 'Funcionario'} subtitle="Detalhes do cadastro">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {item ? (
        <>
          <View style={styles.actionsRow}>
            {canEditEmployee ? (
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push({ pathname: `/(stack)/${Routes.EMPLOYEE_EDIT}` as never, params: { employeeId: item.id } } as never)}
              >
                <Text style={styles.actionButtonText}>Editar cadastro</Text>
              </Pressable>
            ) : null}

            {canManageAddresses ? (
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: `/(stack)/${Routes.EMPLOYEE_ADDRESS_CREATE}` as never,
                  params: { employeeId: item.id, employeeName: item.fullName },
                } as never)}
              >
                <Text style={styles.actionButtonText}>Adicionar endereco</Text>
              </Pressable>
            ) : null}

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
            ) : null}
          </View>

          {!canEditEmployee && !canManageAddresses && !canToggleStatus ? (
            <Text style={styles.helperText}>O sistema web nao liberou alteracoes para este funcionario.</Text>
          ) : null}

          <DetailSection title="Cadastro">
            <DetailRow label="Primeiro nome" value={item.firstName} />
            <DetailRow label="Sobrenome" value={item.lastName} />
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
              <View key={address.id} style={styles.addressCardWrap}>
                <RecordCard title={address.label} />
                {canManageAddresses ? (
                  <Pressable
                    style={[styles.removeButton, removingAddressId === address.id && styles.actionButtonDisabled]}
                    onPress={() => handleRemoveAddress(address.id)}
                    disabled={removingAddressId === address.id}
                  >
                    <Text style={styles.removeButtonText}>
                      {removingAddressId === address.id ? 'Removendo...' : 'Remover endereco'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
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
  actionsRow: {
    gap: 10,
    marginBottom: 14,
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0f766e',
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
  addressCardWrap: {
    marginBottom: 10,
  },
  removeButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.45)',
    backgroundColor: 'rgba(127, 29, 29, 0.18)',
  },
  removeButtonText: {
    color: '#fecaca',
    fontWeight: '700',
    fontSize: 13,
  },
});

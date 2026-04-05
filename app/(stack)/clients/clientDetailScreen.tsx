import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailRow, DetailSection, EmptyState, RecordCard } from '@/components/management/Cards';
import { useClientDetail } from '@/hooks/useClient';
import { formatDateLabel } from '@/utils/managementUi';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ClientDetailScreen() {
  const params = useLocalSearchParams<{ clientId?: string }>();
  const { item, loading, error } = useClientDetail(params.clientId);
  const permissions = item?.permissions;

  return (
    <AppShell title={item?.name ?? 'Cliente'} subtitle="Detalhes do cadastro">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {item ? (
        <>
          {permissions ? (
            <View style={styles.actionsRow}>
              {permissions.canEditClient ? (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push({ pathname: `/(stack)/${Routes.CLIENT_EDIT}` as never, params: { clientId: item.id } } as never)}
                >
                  <Text style={styles.actionButtonText}>Editar cadastro</Text>
                </Pressable>
              ) : null}

              {permissions.canManageAddresses ? (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push({ pathname: `/(stack)/${Routes.CLIENT_ADDRESS_CREATE}` as never, params: { clientId: item.id, clientName: item.name } } as never)}
                >
                  <Text style={styles.actionButtonText}>Adicionar endereco</Text>
                </Pressable>
              ) : null}

              {permissions.canCreateServiceOrder ? (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push({
                    pathname: `/(stack)/${Routes.CLIENT_SERVICE_CREATE}` as never,
                    params: {
                      clientId: item.id,
                      clientName: item.name,
                      operationCode: permissions.nextOperationCode ?? '',
                    },
                  } as never)}
                >
                  <Text style={styles.actionButtonText}>Adicionar servico</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <DetailSection title="Cadastro">
            <DetailRow label="Nome" value={item.name} />
            <DetailRow label="Email" value={item.email} />
            <DetailRow label="Telefone" value={item.phone} />
            <DetailRow label="CPF" value={item.cpf || '-'} />
            <DetailRow label="CNPJ" value={item.cnpj || '-'} />
            <DetailRow label="Criado em" value={formatDateLabel(item.insertDate)} />
          </DetailSection>

          <DetailSection title="Enderecos">
            {item.addresses.length ? item.addresses.map((address) => (
              <RecordCard key={address.id} title={address.label} />
            )) : <EmptyState message="Cliente sem enderecos cadastrados." />}
          </DetailSection>

          <DetailSection title="Ordens vinculadas">
            {item.recentOrders.length ? item.recentOrders.map((order) => (
              <RecordCard
                key={order.id}
                title={`OS ${order.operationCode}`}
                subtitle={order.statusLabel}
                meta={formatDateLabel(order.insertDate)}
              />
            )) : <EmptyState message="Nenhuma ordem vinculada a este cliente." />}
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
});

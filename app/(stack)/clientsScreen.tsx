import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { Badge, EmptyState, RecordCard } from '@/components/management/Cards';
import { useManagementAccess } from '@/contexts/managementAccessContext';
import useClientList from '@/hooks/useClient/useClientList';
import { formatDateLabel } from '@/utils/managementUi';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ClientsScreen() {
  const { access } = useManagementAccess();
  const { items, searchQuery, setSearchQuery, loading, error } = useClientList();

  return (
    <AppShell
      title="Clientes"
      subtitle="Gestao e consulta de clientes"
      rightAction={access?.can_manage_client ? (
        <Pressable style={styles.addButton} onPress={() => router.push(`/(stack)/${Routes.CLIENT_CREATE}` as never)}>
          <MaterialIcons name="person-add-alt-1" size={20} color="#f8fafc" />
        </Pressable>
      ) : undefined}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome, email, CPF ou CNPJ"
        placeholderTextColor="#64748b"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View>
        {items.map((client) => (
          <RecordCard
            key={client.id}
            title={client.name}
            subtitle={`${client.email} • ${client.phone}`}
            meta={`Enderecos: ${client.addressCount} • Cadastro: ${formatDateLabel(client.insertDate)}`}
            badge={<Badge label={client.cnpj ? 'CNPJ' : 'CPF'} color="#38bdf8" />}
            onPress={() => router.push({ pathname: `/(stack)/${Routes.CLIENT_DETAIL}` as never, params: { clientId: client.id } } as never)}
          />
        ))}

        {!loading && !items.length ? <EmptyState message="Nenhum cliente encontrado." /> : null}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 118, 110, 0.92)',
  },
  searchInput: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    color: '#f8fafc',
    marginBottom: 12,
  },
  loader: {
    marginVertical: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    marginBottom: 12,
  },
});

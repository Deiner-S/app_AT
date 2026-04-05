import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { Badge, EmptyState, RecordCard } from '@/components/management/Cards';
import { useManagementAccess } from '@/contexts/managementAccessContext';
import { useChecklistItemList } from '@/hooks/useChecklistItem';
import { formatDateLabel } from '@/utils/managementUi';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChecklistItemsScreen() {
  const { access } = useManagementAccess();
  const { items, searchQuery, setSearchQuery, loading, error } = useChecklistItemList();

  return (
    <AppShell
      title="Itens de checklist"
      subtitle="Base de itens utilizados nas OS"
      rightAction={access?.can_manage_checklist_item ? (
        <Pressable style={styles.addButton} onPress={() => router.push(`/(stack)/${Routes.CHECKLIST_ITEM_CREATE}` as never)}>
          <MaterialIcons name="playlist-add" size={22} color="#f8fafc" />
        </Pressable>
      ) : undefined}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar item por nome"
        placeholderTextColor="#64748b"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View>
        {items.map((item) => (
          <RecordCard
            key={item.id}
            title={item.name}
            subtitle={`Uso em checklist: ${item.usageCount}`}
            meta={`Criado em: ${formatDateLabel(item.insertDate)}`}
            badge={<Badge label={item.statusLabel} color={item.status === 1 ? '#22c55e' : '#f97316'} />}
            onPress={() => router.push({ pathname: `/(stack)/${Routes.CHECKLIST_ITEM_DETAIL}` as never, params: { itemId: item.id } } as never)}
          />
        ))}

        {!loading && !items.length ? <EmptyState message="Nenhum item de checklist encontrado." /> : null}
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

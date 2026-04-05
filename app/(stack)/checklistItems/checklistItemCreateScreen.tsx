import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField } from '@/components/management/FormControls';
import { useChecklistItemForm } from '@/hooks/useChecklistItem';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ChecklistItemCreateScreen() {
  const { values, errors, submitting, formError, setFieldValue, submit } = useChecklistItemForm();

  async function handleSubmit() {
    const detail = await submit();

    if (!detail) {
      return;
    }

    router.replace({
      pathname: `/(stack)/${Routes.CHECKLIST_ITEM_DETAIL}` as never,
      params: { itemId: detail.id },
    } as never);
  }

  return (
    <AppShell title="Novo item" subtitle="Cadastro de item de checklist">
      <DetailSection title="Dados do item">
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <FormField
          label="Nome"
          value={values.name}
          onChangeText={(value) => setFieldValue('name', value)}
          error={errors.name}
          placeholder="Ex.: Verificar pneus"
        />

        <FormActions submitLabel="Cadastrar item" onSubmit={() => { void handleSubmit(); }} submitting={submitting} />
      </DetailSection>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    marginBottom: 12,
  },
});

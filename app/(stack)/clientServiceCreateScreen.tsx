import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField, ReadOnlyField } from '@/components/management/FormControls';
import useClientServiceOrderForm from '@/hooks/useClient/useClientServiceOrderForm';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ClientServiceCreateScreen() {
  const params = useLocalSearchParams<{ clientId?: string; clientName?: string; operationCode?: string }>();
  const { values, errors, submitting, formError, setFieldValue, submit } = useClientServiceOrderForm(
    params.clientId,
    params.operationCode ?? ''
  );

  async function handleSubmit() {
    const detail = await submit();

    if (!detail) {
      return;
    }

    router.replace({
      pathname: `/(stack)/${Routes.CLIENT_DETAIL}` as never,
      params: { clientId: detail.id },
    } as never);
  }

  return (
    <AppShell title="Novo servico" subtitle={params.clientName ? `Cliente: ${params.clientName}` : 'Abertura de ordem'}>
      <DetailSection title="Ordem de servico">
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <ReadOnlyField label="Codigo da OS" value={values.operation_code} />
        {errors.operation_code ? <Text style={styles.errorText}>{errors.operation_code}</Text> : null}
        <FormField
          label="Descricao do problema"
          value={values.symptoms}
          onChangeText={(value) => setFieldValue('symptoms', value)}
          error={errors.symptoms}
          multiline
          placeholder="Descreva o problema relatado pelo cliente"
        />

        <FormActions submitLabel="Abrir ordem de servico" onSubmit={() => { void handleSubmit(); }} submitting={submitting} />
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

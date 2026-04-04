import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField, FormSelect } from '@/components/management/FormControls';
import useClientAddressForm from '@/hooks/useClient/useClientAddressForm';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ClientAddressCreateScreen() {
  const params = useLocalSearchParams<{ clientId?: string; clientName?: string }>();
  const { values, errors, submitting, formError, setFieldValue, submit, stateOptions } = useClientAddressForm(params.clientId);

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
    <AppShell title="Novo endereco" subtitle={params.clientName ? `Cliente: ${params.clientName}` : 'Associacao de endereco'}>
      <DetailSection title="Endereco">
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <FormField
          label="Rua"
          value={values.street}
          onChangeText={(value) => setFieldValue('street', value)}
          error={errors.street}
          placeholder="Rua Projetada 12"
        />
        <FormField
          label="Numero"
          value={values.number}
          onChangeText={(value) => setFieldValue('number', value)}
          keyboardType="number-pad"
          error={errors.number}
          placeholder="10"
        />
        <FormField
          label="Complemento"
          value={values.complement ?? ''}
          onChangeText={(value) => setFieldValue('complement', value)}
          error={errors.complement}
          placeholder="Galpao A"
        />
        <FormField
          label="Cidade"
          value={values.city}
          onChangeText={(value) => setFieldValue('city', value)}
          error={errors.city}
          placeholder="Sao Paulo"
        />
        <FormSelect
          label="Estado"
          value={values.state}
          onValueChange={(value) => setFieldValue('state', value)}
          options={stateOptions}
          error={errors.state}
        />
        <FormField
          label="CEP"
          value={values.zip_code}
          onChangeText={(value) => setFieldValue('zip_code', value)}
          keyboardType="number-pad"
          error={errors.zip_code}
          placeholder="12345-678"
        />

        <FormActions submitLabel="Salvar endereco" onSubmit={() => { void handleSubmit(); }} submitting={submitting} />
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

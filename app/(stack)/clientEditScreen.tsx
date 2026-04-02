import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField, ReadOnlyField } from '@/components/management/FormControls';
import useClientForm from '@/hooks/useClientForm';
import { executeControllerTask } from '@/services/controllerErrorService';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function ClientEditScreen() {
  const params = useLocalSearchParams<{ clientId?: string }>();
  const { values, errors, loading, submitting, formError, setFieldValue, submit } = useClientForm('edit', params.clientId);

  async function handleSubmit() {
    const detail = await executeControllerTask(() => submit(), {
      operation: 'editar cliente',
    });

    if (!detail) {
      return;
    }

    router.replace({
      pathname: `/(stack)/${Routes.CLIENT_DETAIL}` as never,
      params: { clientId: detail.id },
    } as never);
  }

  return (
    <AppShell title="Editar cliente" subtitle="Atualizacao do cadastro existente">
      {loading ? <ActivityIndicator color="#38bdf8" style={styles.loader} /> : null}

      <DetailSection title="Cadastro">
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <ReadOnlyField label="CPF" value={values.cpf} />
        <ReadOnlyField label="CNPJ" value={values.cnpj} />
        <FormField
          label="Nome"
          value={values.name}
          onChangeText={(value) => setFieldValue('name', value)}
          error={errors.name}
          placeholder="Nome do cliente"
        />
        <FormField
          label="Email"
          value={values.email}
          onChangeText={(value) => setFieldValue('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          placeholder="cliente@empresa.com"
        />
        <FormField
          label="Telefone"
          value={values.phone}
          onChangeText={(value) => setFieldValue('phone', value)}
          keyboardType="phone-pad"
          error={errors.phone}
          placeholder="(11) 98765-4321"
        />

        <FormActions submitLabel="Salvar alteracoes" onSubmit={() => { void handleSubmit(); }} submitting={submitting || loading} />
      </DetailSection>
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
});

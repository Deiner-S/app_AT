import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField } from '@/components/management/FormControls';
import { useClientForm } from '@/hooks/useClient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ClientCreateScreen() {
  const { values, errors, submitting, formError, setFieldValue, submit } = useClientForm('create');

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
    <AppShell title="Novo cliente" subtitle="Cadastro administrativo no mobile">
      <DetailSection title="Dados do cliente">
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <FormField
          label="CNPJ"
          value={values.cnpj}
          onChangeText={(value) => setFieldValue('cnpj', value)}
          keyboardType="number-pad"
          error={errors.cnpj}
          placeholder="00.000.000/0000-00"
        />
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

        <FormActions submitLabel="Cadastrar cliente" onSubmit={() => { void handleSubmit(); }} submitting={submitting} />
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

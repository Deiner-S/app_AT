import { Routes } from '@/app/routes';
import AppShell from '@/components/appShell/AppShell';
import { DetailSection } from '@/components/management/Cards';
import { FormActions, FormField, FormSelect } from '@/components/management/FormControls';
import useEmployeeAddressForm from '@/hooks/useEmployee/useEmployeeAddressForm';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function EmployeeAddressCreateScreen() {
  const params = useLocalSearchParams<{ employeeId?: string; employeeName?: string }>();
  const { values, errors, submitting, formError, setFieldValue, submit, stateOptions } = useEmployeeAddressForm(params.employeeId);

  async function handleSubmit() {
    const detail = await submit();

    if (!detail) {
      return;
    }

    router.replace({
      pathname: `/(stack)/${Routes.EMPLOYEE_DETAIL}` as never,
      params: { employeeId: detail.id },
    } as never);
  }

  return (
    <AppShell title="Novo endereco" subtitle={params.employeeName ? `Funcionario: ${params.employeeName}` : 'Associacao de endereco'}>
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
          emptyOptionLabel="Selecione um estado"
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

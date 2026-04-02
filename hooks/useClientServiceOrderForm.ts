import { createClientServiceOrder } from '@/services/clientService';
import type { ClientDetail, ClientServiceOrderPayload } from '@/types/management';
import {
  validateServiceOperationCodeField,
  validateServiceSymptomsField,
} from '@/utils/validation';
import { useCallback, useState } from 'react';

type ServiceField = keyof ClientServiceOrderPayload;
type ServiceErrors = Partial<Record<ServiceField, string>>;

export default function useClientServiceOrderForm(clientId?: string, initialOperationCode = '') {
  const [values, setValues] = useState<ClientServiceOrderPayload>({
    operation_code: initialOperationCode,
    symptoms: '',
  });
  const [errors, setErrors] = useState<ServiceErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const setFieldValue = useCallback((field: ServiceField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: current[field]
        ? (() => {
            try {
              if (field === 'operation_code') {
                validateServiceOperationCodeField(value);
              } else {
                validateServiceSymptomsField(value);
              }
              return undefined;
            } catch (error) {
              return error instanceof Error ? error.message : 'Campo invalido.';
            }
          })()
        : undefined,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors: ServiceErrors = {};

    try {
      validateServiceOperationCodeField(values.operation_code);
    } catch (error) {
      nextErrors.operation_code = error instanceof Error ? error.message : 'Campo invalido.';
    }

    try {
      validateServiceSymptomsField(values.symptoms);
    } catch (error) {
      nextErrors.symptoms = error instanceof Error ? error.message : 'Campo invalido.';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }, [values.operation_code, values.symptoms]);

  const submit = useCallback(async (): Promise<ClientDetail> => {
    if (!clientId) {
      throw new Error('Identificador invalido.');
    }

    if (!validateForm()) {
      throw new Error('Corrija os campos destacados antes de continuar.');
    }

    setSubmitting(true);
    setFormError(null);

    try {
      return await createClientServiceOrder(clientId, values);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao abrir ordem de servico.';
      setFormError(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [clientId, validateForm, values]);

  return {
    values,
    errors,
    submitting,
    formError,
    setFieldValue,
    submit,
  };
}

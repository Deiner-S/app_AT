import {
  createClient,
  fetchClientDetail,
  updateClient,
} from '@/services/clientService';
import type { ClientCreatePayload, ClientDetail, ClientUpdatePayload } from '@/types/management';
import {
  formatCnpjInput,
  formatPhoneInput,
  validateClientCnpjField,
  validateClientEmailField,
  validateClientNameField,
  validateClientPhoneField,
} from '@/utils/validation';
import { useCallback, useEffect, useState } from 'react';

type ClientFormMode = 'create' | 'edit';

type ClientFormValues = {
  cnpj: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
};

type ClientField = keyof ClientFormValues;
type ClientFormErrors = Partial<Record<ClientField, string>>;

const INITIAL_VALUES: ClientFormValues = {
  cnpj: '',
  cpf: '',
  name: '',
  email: '',
  phone: '',
};

function getFieldError(field: ClientField, value: string, mode: ClientFormMode): string | undefined {
  try {
    switch (field) {
      case 'cnpj':
        if (mode === 'edit') {
          return undefined;
        }
        validateClientCnpjField(value);
        return undefined;
      case 'name':
        validateClientNameField(value);
        return undefined;
      case 'email':
        validateClientEmailField(value);
        return undefined;
      case 'phone':
        validateClientPhoneField(value);
        return undefined;
      default:
        return undefined;
    }
  } catch (error) {
    return error instanceof Error ? error.message : 'Campo invalido.';
  }
}

export default function useClientForm(mode: ClientFormMode, clientId?: string) {
  const [values, setValues] = useState<ClientFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ClientFormErrors>({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'edit' || !clientId) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadClient() {
      try {
        setLoading(true);
        setFormError(null);
        const detail = await fetchClientDetail(clientId);

        if (!active) {
          return;
        }

        setValues({
          cnpj: detail.cnpj ?? '',
          cpf: detail.cpf ?? '',
          name: detail.name,
          email: detail.email,
          phone: detail.phone,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setFormError(error instanceof Error ? error.message : 'Falha ao carregar cliente.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadClient();

    return () => {
      active = false;
    };
  }, [clientId, mode]);

  const setFieldValue = useCallback((field: ClientField, value: string) => {
    const nextValue = field === 'cnpj'
      ? formatCnpjInput(value)
      : field === 'phone'
        ? formatPhoneInput(value)
        : value;

    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({
      ...current,
      [field]: current[field] ? getFieldError(field, nextValue, mode) : undefined,
    }));
  }, [mode]);

  const validateForm = useCallback(() => {
    const nextErrors: ClientFormErrors = {
      cnpj: getFieldError('cnpj', values.cnpj, mode),
      name: getFieldError('name', values.name, mode),
      email: getFieldError('email', values.email, mode),
      phone: getFieldError('phone', values.phone, mode),
    };

    if (mode === 'edit') {
      delete nextErrors.cnpj;
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }, [mode, values.cnpj, values.email, values.name, values.phone]);

  const submit = useCallback(async (): Promise<ClientDetail> => {
    if (!validateForm()) {
      throw new Error('Corrija os campos destacados antes de continuar.');
    }

    setSubmitting(true);
    setFormError(null);

    try {
      if (mode === 'create') {
        const payload: ClientCreatePayload = {
          cnpj: values.cnpj,
          name: values.name,
          email: values.email,
          phone: values.phone,
        };

        return await createClient(payload);
      }

      if (!clientId) {
        throw new Error('Identificador invalido.');
      }

      const payload: ClientUpdatePayload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      return await updateClient(clientId, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao salvar cliente.';
      setFormError(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [clientId, mode, validateForm, values.cnpj, values.email, values.name, values.phone]);

  return {
    values,
    errors,
    loading,
    submitting,
    formError,
    setFieldValue,
    submit,
  };
}

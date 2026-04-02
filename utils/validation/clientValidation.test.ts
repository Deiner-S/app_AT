import {
  formatCnpjInput,
  formatPhoneInput,
  formatZipCodeInput,
  validateClientAddressPayload,
  validateClientCreatePayload,
  validateClientServiceOrderPayload,
  validateClientUpdatePayload,
} from '@/utils/validation';

describe('clientValidation', () => {
  it('formats cnpj input as the web expects', () => {
    expect(formatCnpjInput('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('formats phone input as the web expects', () => {
    expect(formatPhoneInput('11987654321')).toBe('(11) 98765-4321');
  });

  it('formats zip code input as the web expects', () => {
    expect(formatZipCodeInput('12345678')).toBe('12345-678');
  });

  it('validates client creation payload', () => {
    expect(validateClientCreatePayload({
      cnpj: '12.345.678/0001-90',
      name: 'Cliente Teste',
      email: 'cliente@empresa.com',
      phone: '(11) 98765-4321',
    })).toEqual({
      cnpj: '12.345.678/0001-90',
      name: 'Cliente Teste',
      email: 'cliente@empresa.com',
      phone: '(11) 98765-4321',
    });
  });

  it('rejects invalid client name on creation', () => {
    expect(() => validateClientCreatePayload({
      cnpj: '12.345.678/0001-90',
      name: 'Cliente 1',
      email: 'cliente@empresa.com',
      phone: '(11) 98765-4321',
    })).toThrow('name deve conter somente letras e espacos.');
  });

  it('validates client update payload', () => {
    expect(validateClientUpdatePayload({
      name: 'Cliente Editado',
      email: 'cliente@empresa.com.br',
      phone: '(11) 3333-4444',
    })).toEqual({
      name: 'Cliente Editado',
      email: 'cliente@empresa.com.br',
      phone: '(11) 3333-4444',
    });
  });

  it('validates address payload', () => {
    expect(validateClientAddressPayload({
      street: 'Rua Projetada 12',
      number: '10',
      complement: 'Galpao 2',
      city: 'Sao Paulo',
      state: 'Sao Paulo',
      zip_code: '12345-678',
    })).toEqual({
      street: 'Rua Projetada 12',
      number: '10',
      complement: 'Galpao 2',
      city: 'Sao Paulo',
      state: 'Sao Paulo',
      zip_code: '12345-678',
    });
  });

  it('rejects invalid address state payload', () => {
    expect(() => validateClientAddressPayload({
      street: 'Rua Projetada 12',
      number: '10',
      complement: '',
      city: 'Sao Paulo',
      state: 'SP',
      zip_code: '12345-678',
    })).toThrow('Selecione um estado valido.');
  });

  it('validates service order payload', () => {
    expect(validateClientServiceOrderPayload({
      operation_code: '000001',
      symptoms: 'Motor sem pressao',
    })).toEqual({
      operation_code: '000001',
      symptoms: 'Motor sem pressao',
    });
  });
});

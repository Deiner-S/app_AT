import { executeAsyncWithLayerException } from '@/exceptions/AppLayerException';
import ClientServiceException from '@/exceptions/ClientServiceException';
import { MANAGEMENT_REQUEST_TIMEOUT_MS, APP_API_BASE_URL } from '@/services/apiConfig';
import { httpRequest } from '@/services/networkService';
import { getTokenStorange } from '@/storange/authStorange';
import type {
  ClientAddressPayload,
  ClientCreatePayload,
  ClientDetail,
  ClientListItem,
  ClientServiceOrderPayload,
  ClientUpdatePayload,
} from '@/types/management';
import {
  validateClientAddressPayload,
  validateClientCreatePayload,
  validateClientDetailResponse,
  validateClientServiceOrderPayload,
  validateClientUpdatePayload,
  validateClientsResponse,
} from '@/utils/validation';

async function getAuthorizationHeaders() {
  const tokens = await getTokenStorange();

  if (!tokens?.access) {
    throw new Error('AUTH_TOKEN_MISSING');
  }

  return {
    Authorization: `Bearer ${tokens.access}`,
  };
}

function buildQuery(searchQuery?: string): string {
  const normalizedQuery = searchQuery?.trim();

  if (!normalizedQuery) {
    return '';
  }

  return `?search=${encodeURIComponent(normalizedQuery)}`;
}

export async function fetchClients(searchQuery = ''): Promise<ClientListItem[]> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<ClientListItem[]>({
      method: 'GET',
      endpoint: `/mobile/clients_api/${buildQuery(searchQuery)}`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateClientsResponse(response);
  }, ClientServiceException);
}

export async function fetchClientDetail(clientId: string): Promise<ClientDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<ClientDetail>({
      method: 'GET',
      endpoint: `/mobile/clients_api/${clientId}/detail/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateClientDetailResponse(response);
  }, ClientServiceException);
}

export async function createClient(payload: ClientCreatePayload): Promise<ClientDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();
    const body = validateClientCreatePayload(payload);

    const response = await httpRequest<ClientDetail>({
      method: 'POST',
      endpoint: '/mobile/clients_api/',
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
      body,
    });

    return validateClientDetailResponse(response);
  }, ClientServiceException);
}

export async function updateClient(clientId: string, payload: ClientUpdatePayload): Promise<ClientDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();
    const body = validateClientUpdatePayload(payload);

    const response = await httpRequest<ClientDetail>({
      method: 'PATCH',
      endpoint: `/mobile/clients_api/${clientId}/detail/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
      body,
    });

    return validateClientDetailResponse(response);
  }, ClientServiceException);
}

export async function createClientAddress(
  clientId: string,
  payload: ClientAddressPayload
): Promise<ClientDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();
    const body = validateClientAddressPayload(payload);

    const response = await httpRequest<ClientDetail>({
      method: 'POST',
      endpoint: `/mobile/clients_api/${clientId}/addresses/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
      body,
    });

    return validateClientDetailResponse(response);
  }, ClientServiceException);
}

export async function createClientServiceOrder(
  clientId: string,
  payload: ClientServiceOrderPayload
): Promise<ClientDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();
    const body = validateClientServiceOrderPayload(payload);

    const response = await httpRequest<ClientDetail>({
      method: 'POST',
      endpoint: `/mobile/clients_api/${clientId}/services/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
      body,
    });

    return validateClientDetailResponse(response);
  }, ClientServiceException);
}

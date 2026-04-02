import { executeAsyncWithLayerException } from '@/exceptions/AppLayerException';
import ManagementServiceException from '@/exceptions/ManagementServiceException';
import { MANAGEMENT_REQUEST_TIMEOUT_MS, APP_API_BASE_URL } from '@/services/apiConfig';
import { httpRequest } from '@/services/networkService';
import { getTokenStorange } from '@/storange/authStorange';
import type {
  ChecklistItemDetail,
  ChecklistItemListItem,
  ClientDetail,
  ClientListItem,
  DashboardPayload,
  EmployeeDetail,
  EmployeeListItem,
} from '@/types/management';
import {
  validateChecklistItemDetailResponse,
  validateChecklistItemsResponse,
  validateClientDetailResponse,
  validateClientsResponse,
  validateDashboardResponse,
  validateEmployeeDetailResponse,
  validateEmployeesResponse,
  validateOkResponse,
} from '@/utils/validation';

export type ManagementListResource = 'employee' | 'checklistItem';
export type ManagementDetailResource = 'employee' | 'checklistItem';

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

export async function fetchDashboard(): Promise<DashboardPayload> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<DashboardPayload>({
      method: 'GET',
      endpoint: '/mobile/dashboard_api/',
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateDashboardResponse(response);
  }, ManagementServiceException);
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
  }, ManagementServiceException);
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
  }, ManagementServiceException);
}

export async function fetchEmployees(searchQuery = ''): Promise<EmployeeListItem[]> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<EmployeeListItem[]>({
      method: 'GET',
      endpoint: `/mobile/employees_api/${buildQuery(searchQuery)}`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateEmployeesResponse(response);
  }, ManagementServiceException);
}

export async function fetchEmployeeDetail(employeeId: string): Promise<EmployeeDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<EmployeeDetail>({
      method: 'GET',
      endpoint: `/mobile/employees_api/${employeeId}/detail/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateEmployeeDetailResponse(response);
  }, ManagementServiceException);
}

export async function toggleEmployeeStatus(employeeId: string): Promise<boolean> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<{ ok: boolean }>({
      method: 'POST',
      endpoint: `/mobile/employees_api/${employeeId}/toggle-status/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateOkResponse(response).ok;
  }, ManagementServiceException);
}

export async function fetchChecklistItems(searchQuery = ''): Promise<ChecklistItemListItem[]> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<ChecklistItemListItem[]>({
      method: 'GET',
      endpoint: `/mobile/checklist_items_api/${buildQuery(searchQuery)}`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateChecklistItemsResponse(response);
  }, ManagementServiceException);
}

export async function fetchChecklistItemDetail(itemId: string): Promise<ChecklistItemDetail> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<ChecklistItemDetail>({
      method: 'GET',
      endpoint: `/mobile/checklist_items_api/${itemId}/detail/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateChecklistItemDetailResponse(response);
  }, ManagementServiceException);
}

export async function toggleChecklistItemStatus(itemId: string): Promise<boolean> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getAuthorizationHeaders();

    const response = await httpRequest<{ ok: boolean }>({
      method: 'POST',
      endpoint: `/mobile/checklist_items_api/${itemId}/toggle-status/`,
      BASE_URL: APP_API_BASE_URL,
      timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
      headers,
    });

    return validateOkResponse(response).ok;
  }, ManagementServiceException);
}

export async function loadManagementList(resource: ManagementListResource, searchQuery = '') {
  return executeAsyncWithLayerException(async () => {
    switch (resource) {
      case 'employee':
        return fetchEmployees(searchQuery);
      case 'checklistItem':
        return fetchChecklistItems(searchQuery);
      default:
        throw new Error('MANAGEMENT_LIST_RESOURCE_INVALID');
    }
  }, ManagementServiceException);
}

export async function loadManagementDetail(resource: ManagementDetailResource, identifier: string) {
  return executeAsyncWithLayerException(async () => {
    switch (resource) {
      case 'employee':
        return fetchEmployeeDetail(identifier);
      case 'checklistItem':
        return fetchChecklistItemDetail(identifier);
      default:
        throw new Error('MANAGEMENT_DETAIL_RESOURCE_INVALID');
    }
  }, ManagementServiceException);
}

export async function toggleManagementStatus(resource: ManagementDetailResource, identifier: string) {
  return executeAsyncWithLayerException(async () => {
    switch (resource) {
      case 'employee':
        return toggleEmployeeStatus(identifier);
      case 'checklistItem':
        return toggleChecklistItemStatus(identifier);
      default:
        throw new Error('MANAGEMENT_TOGGLE_RESOURCE_INVALID');
    }
  }, ManagementServiceException);
}

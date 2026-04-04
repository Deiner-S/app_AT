import { executeAsyncWithLayerException } from '@/exceptions/AppLayerException';
import ManagementServiceException from '@/exceptions/ManagementServiceException';
import { MANAGEMENT_REQUEST_TIMEOUT_MS, APP_API_BASE_URL } from '@/services/apiConfig';
import { getManagementAuthorizationHeaders } from '@/services/managementApiHelpers';
import { httpRequest } from '@/services/networkService';
import type { DashboardPayload } from '@/types/management';
import { validateDashboardResponse } from '@/utils/validation';

export async function fetchDashboard(): Promise<DashboardPayload> {
  return executeAsyncWithLayerException(async () => {
    const headers = await getManagementAuthorizationHeaders();

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

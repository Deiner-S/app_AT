import AppLayerException, { executeAsyncWithLayerException } from '@/exceptions/AppLayerException';
import { APP_API_BASE_URL, MANAGEMENT_REQUEST_TIMEOUT_MS } from '@/services/apiConfig';
import { buildManagementQuery, getManagementAuthorizationHeaders } from '@/services/managementApiHelpers';
import { httpRequest } from '@/services/networkService';

type ExceptionConstructor<E extends AppLayerException> = new (message: string, cause?: unknown) => E;

export default abstract class BaseManagementResourceService<E extends AppLayerException> {
  protected abstract readonly resourceEndpoint: string;
  protected abstract readonly ExceptionType: ExceptionConstructor<E>;

  protected async request<T>(method: 'GET' | 'POST' | 'PATCH', endpoint: string, body?: unknown): Promise<T> {
    return executeAsyncWithLayerException(async () => {
      const headers = await getManagementAuthorizationHeaders();

      return httpRequest<T>({
        method,
        endpoint,
        BASE_URL: APP_API_BASE_URL,
        timeoutMs: MANAGEMENT_REQUEST_TIMEOUT_MS,
        headers,
        body,
      });
    }, this.ExceptionType);
  }

  protected async fetchList<T>(searchQuery: string, validate: (payload: unknown) => T[]): Promise<T[]> {
    const response = await this.request<unknown>(
      'GET',
      `${this.resourceEndpoint}${buildManagementQuery(searchQuery)}`
    );
    return validate(response);
  }

  protected async fetchDetail<T>(identifier: string, validate: (payload: unknown) => T): Promise<T> {
    const response = await this.request<unknown>('GET', `${this.resourceEndpoint}${identifier}/detail/`);
    return validate(response);
  }

  protected async submit<T>(
    method: 'POST' | 'PATCH',
    endpoint: string,
    body: unknown,
    validate: (payload: unknown) => T
  ): Promise<T> {
    const response = await this.request<unknown>(method, endpoint, body);
    return validate(response);
  }

  protected async toggleStatus(identifier: string): Promise<boolean> {
    const response = await this.request<unknown>(
      'POST',
      `${this.resourceEndpoint}${identifier}/toggle-status/`
    );

    return this.validateOkResponse(response).ok;
  }

  protected abstract validateOkResponse(payload: unknown): { ok: boolean };
}

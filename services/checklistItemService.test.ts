import { getTokenStorange } from '@/storange/authStorange';
import { checklistItemService } from './checklistItemService';
import { httpRequest } from './networkService';

jest.mock('@/storange/authStorange', () => ({
  getTokenStorange: jest.fn(),
}));

jest.mock('./networkService', () => ({
  httpRequest: jest.fn(),
}));

const mockGetTokenStorange = getTokenStorange as jest.MockedFunction<typeof getTokenStorange>;
const mockHttpRequest = httpRequest as jest.MockedFunction<typeof httpRequest>;

const AUTH_HEADERS = {
  Authorization: 'Bearer access-token',
};

describe('checklistItemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTokenStorange.mockResolvedValue({
      access: 'access-token',
      refresh: 'refresh-token',
    });
  });

  it('fetches checklist items with encoded search query', async () => {
    mockHttpRequest.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Freio',
        status: 1,
        statusLabel: 'Ativo',
        usageCount: 8,
        insertDate: '2026-03-31T12:00:00.000Z',
      },
    ] as never);

    await expect(checklistItemService.fetchChecklistItems('freio dianteiro')).resolves.toHaveLength(1);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: 'GET',
      endpoint: '/mobile/checklist_items_api/?search=freio%20dianteiro',
      BASE_URL: 'https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador',
      timeoutMs: 20000,
      headers: AUTH_HEADERS,
      body: undefined,
    });
  });

  it('fetches checklist item detail', async () => {
    mockHttpRequest.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Freio',
      status: 1,
      statusLabel: 'Ativo',
      usageCount: 8,
      insertDate: '2026-03-31T12:00:00.000Z',
      permissions: {
        canToggleStatus: true,
      },
    } as never);

    await expect(checklistItemService.fetchChecklistItemDetail('11111111-1111-4111-8111-111111111111')).resolves.toEqual(
      expect.objectContaining({
        name: 'Freio',
      })
    );
  });

  it('toggles checklist item status and returns backend ok flag', async () => {
    mockHttpRequest.mockResolvedValue({ ok: true } as never);

    await expect(checklistItemService.toggleChecklistItemStatus('11111111-1111-4111-8111-111111111111')).resolves.toBe(true);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: 'POST',
      endpoint: '/mobile/checklist_items_api/11111111-1111-4111-8111-111111111111/toggle-status/',
      BASE_URL: 'https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador',
      timeoutMs: 20000,
      headers: AUTH_HEADERS,
      body: undefined,
    });
  });
});

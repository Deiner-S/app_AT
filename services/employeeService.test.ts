import { getTokenStorange } from '@/storange/authStorange';
import { employeeService } from './employeeService';
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

describe('employeeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTokenStorange.mockResolvedValue({
      access: 'access-token',
      refresh: 'refresh-token',
    });
  });

  it('fetches employees and validates boolean status', async () => {
    mockHttpRequest.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        username: 'deiner',
        fullName: 'Deiner Silva',
        email: 'deiner@example.com',
        cpf: '123',
        phone: '9999',
        position: '1',
        positionLabel: 'Gerente',
        isActive: true,
        addressCount: 1,
        insertDate: '2026-03-31T12:00:00.000Z',
      },
    ] as never);

    await expect(employeeService.fetchEmployees()).resolves.toHaveLength(1);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: 'GET',
      endpoint: '/mobile/employees_api/',
      BASE_URL: 'https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador',
      timeoutMs: 20000,
      headers: AUTH_HEADERS,
      body: undefined,
    });
  });

  it('fetches employee detail', async () => {
    mockHttpRequest.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      username: 'deiner',
      fullName: 'Deiner Silva',
      email: 'deiner@example.com',
      cpf: '123',
      phone: '9999',
      position: '1',
      positionLabel: 'Gerente',
      isActive: true,
      addressCount: 1,
      insertDate: '2026-03-31T12:00:00.000Z',
      addresses: [
        {
          id: '22222222-2222-4222-8222-222222222222',
          label: 'Rua A, 10 - Cidade/UF',
        },
      ],
      permissions: {
        canToggleStatus: true,
      },
    } as never);

    await expect(employeeService.fetchEmployeeDetail('11111111-1111-4111-8111-111111111111')).resolves.toEqual(
      expect.objectContaining({
        fullName: 'Deiner Silva',
      })
    );
  });

  it('toggles employee status and returns backend ok flag', async () => {
    mockHttpRequest.mockResolvedValue({ ok: true } as never);

    await expect(employeeService.toggleEmployeeStatus('11111111-1111-4111-8111-111111111111')).resolves.toBe(true);

    expect(mockHttpRequest).toHaveBeenCalledWith({
      method: 'POST',
      endpoint: '/mobile/employees_api/11111111-1111-4111-8111-111111111111/toggle-status/',
      BASE_URL: 'https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador',
      timeoutMs: 20000,
      headers: AUTH_HEADERS,
      body: undefined,
    });
  });

  it('fails when backend payload does not match expected structure', async () => {
    mockHttpRequest.mockResolvedValue({ invalid: true } as never);

    await expect(employeeService.fetchEmployees()).rejects.toThrow('employees deve ser uma lista.');
  });
});

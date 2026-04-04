import ManagementServiceException from '@/exceptions/ManagementServiceException';
import BaseManagementResourceService from '@/services/baseManagementResourceService';
import type { EmployeeDetail, EmployeeListItem } from '@/types/management';
import {
  validateEmployeeDetailResponse,
  validateEmployeesResponse,
  validateOkResponse,
} from '@/utils/validation';

class EmployeeService extends BaseManagementResourceService<ManagementServiceException> {
  protected readonly resourceEndpoint = '/mobile/employees_api/';
  protected readonly ExceptionType = ManagementServiceException;

  protected validateOkResponse(payload: unknown): { ok: boolean } {
    return validateOkResponse(payload);
  }

  fetchEmployees(searchQuery = ''): Promise<EmployeeListItem[]> {
    return this.fetchList(searchQuery, validateEmployeesResponse);
  }

  fetchEmployeeDetail(employeeId: string): Promise<EmployeeDetail> {
    return this.fetchDetail(employeeId, validateEmployeeDetailResponse);
  }

  toggleEmployeeStatus(employeeId: string): Promise<boolean> {
    return this.toggleStatus(employeeId);
  }
}

export const employeeService = new EmployeeService();

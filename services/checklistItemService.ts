import ManagementServiceException from '@/exceptions/ManagementServiceException';
import BaseManagementResourceService from '@/services/baseManagementResourceService';
import type { ChecklistItemDetail, ChecklistItemListItem } from '@/types/management';
import {
  validateChecklistItemDetailResponse,
  validateChecklistItemsResponse,
  validateOkResponse,
} from '@/utils/validation';

class ChecklistItemService extends BaseManagementResourceService<ManagementServiceException> {
  protected readonly resourceEndpoint = '/mobile/checklist_items_api/';
  protected readonly ExceptionType = ManagementServiceException;

  protected validateOkResponse(payload: unknown): { ok: boolean } {
    return validateOkResponse(payload);
  }

  fetchChecklistItems(searchQuery = ''): Promise<ChecklistItemListItem[]> {
    return this.fetchList(searchQuery, validateChecklistItemsResponse);
  }

  fetchChecklistItemDetail(itemId: string): Promise<ChecklistItemDetail> {
    return this.fetchDetail(itemId, validateChecklistItemDetailResponse);
  }

  toggleChecklistItemStatus(itemId: string): Promise<boolean> {
    return this.toggleStatus(itemId);
  }
}

export const checklistItemService = new ChecklistItemService();

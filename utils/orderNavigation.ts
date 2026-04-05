import { Routes } from '@/app/routes';

export function getOperationalRoute(status: string): string {
  if (status === '2') {
    return Routes.CHECKLIST_MAINTENANCE;
  }

  if (status === '3') {
    return Routes.CHECKLIST_DELIVERY;
  }

  return Routes.CHECKLIST_COLLECTION;
}

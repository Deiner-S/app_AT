import { useManagementAccess } from '@/contexts/managementAccessContext';

export default function useDashboardHook() {
  return useManagementAccess();
}

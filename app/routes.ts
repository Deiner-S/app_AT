export const Routes = {
  HOME: 'homeScreen',
  ORDERS: 'ordersScreen',
  CLIENTS: 'clientsScreen',
  CLIENT_CREATE: 'clientCreateScreen',
  CLIENT_DETAIL: 'clientDetailScreen',
  CLIENT_EDIT: 'clientEditScreen',
  CLIENT_ADDRESS_CREATE: 'clientAddressCreateScreen',
  CLIENT_SERVICE_CREATE: 'clientServiceCreateScreen',
  EMPLOYEES: 'employeesScreen',
  EMPLOYEE_DETAIL: 'employeeDetailScreen',
  EMPLOYEE_EDIT: 'employeeEditScreen',
  EMPLOYEE_ADDRESS_CREATE: 'employeeAddressCreateScreen',
  CHECKLIST_ITEMS: 'checklistItemsScreen',
  CHECKLIST_ITEM_DETAIL: 'checklistItemDetailScreen',
  CHECKLIST: 'checklistScreen',
  DELIVERY_CHECKLIST: 'deliveryChecklistScreen',
  MAINTENANCE: 'maintenanceScreen',
  LOGIN: "/login"
} as const

export type RouteName = typeof Routes[keyof typeof Routes]

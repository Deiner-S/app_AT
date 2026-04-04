export type AccessContext = {
  is_director: boolean;
  is_manager: boolean;
  is_administrative: boolean;
  is_technician: boolean;
  can_view_employee_module: boolean;
  can_create_employee: boolean;
  can_view_client_list: boolean;
  can_view_client_detail: boolean;
  can_manage_client: boolean;
  can_create_service_order: boolean;
  can_view_checklist_item_module: boolean;
  can_manage_checklist_item: boolean;
  can_view_service_panel: boolean;
};

export type DashboardSummary = {
  pendingOrders: number;
  inProgressOrders: number;
  deliveryOrders: number;
  completedOrders: number;
  clients: number;
  employees: number;
  checklistItems: number;
};

export type DashboardModule = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  count: number;
  enabled: boolean;
};

export type DashboardPayload = {
  user: {
    username: string;
    fullName: string;
    position: string;
  };
  summary: DashboardSummary;
  modules: DashboardModule[];
  access: AccessContext;
};

export type DetailPermissions = {
  canToggleStatus: boolean;
};

export type EmployeeDetailPermissions = DetailPermissions & {
  canEditEmployee: boolean;
  canManageAddresses: boolean;
};

export type EmployeePositionOption = {
  value: string;
  label: string;
};

export type ClientDetailPermissions = {
  canEditClient: boolean;
  canManageAddresses: boolean;
  canCreateServiceOrder: boolean;
  nextOperationCode?: string;
};

export type AddressSummary = {
  id: string;
  label: string;
};

export type RelatedOrderSummary = {
  id: string;
  operationCode: string;
  status: string;
  statusLabel: string;
  insertDate?: string;
};

export type ClientListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  addressCount: number;
  insertDate?: string;
};

export type ClientDetail = ClientListItem & {
  addresses: AddressSummary[];
  recentOrders: RelatedOrderSummary[];
  permissions: ClientDetailPermissions;
};

export type ClientCreatePayload = {
  cnpj: string;
  name: string;
  email: string;
  phone: string;
};

export type ClientUpdatePayload = {
  name: string;
  email: string;
  phone: string;
};

export type ClientAddressPayload = {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
};

export type ClientServiceOrderPayload = {
  operation_code: string;
  symptoms: string;
};

export type EmployeeListItem = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  position: string;
  positionLabel: string;
  isActive: boolean;
  addressCount: number;
  insertDate?: string;
};

export type EmployeeDetail = EmployeeListItem & {
  firstName: string;
  lastName: string;
  addresses: AddressSummary[];
  permissions: EmployeeDetailPermissions;
  positionOptions: EmployeePositionOption[];
};

export type EmployeeUpdatePayload = {
  first_name: string;
  last_name: string;
  cpf: string;
  phone: string;
  email: string;
  position: string;
  username: string;
  password?: string;
};

export type EmployeeAddressPayload = {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
};

export type ChecklistItemListItem = {
  id: string;
  name: string;
  status: number;
  statusLabel: string;
  usageCount: number;
  insertDate?: string;
};

export type ChecklistItemDetail = ChecklistItemListItem & {
  permissions: DetailPermissions;
};

export type ChecklistExecutionSummary = {
  id: string;
  itemName: string;
  status: string;
  statusLabel: string;
  employeeName: string;
  insertDate?: string;
};

export type OrderListItem = {
  id: string;
  operationCode: string;
  clientName: string;
  symptoms: string;
  chassi?: string;
  horimetro?: string;
  model?: string;
  status: string;
  statusLabel: string;
  dateIn?: string;
  dateOut?: string;
  service?: string;
  insertDate?: string;
};

export type OrderDetail = OrderListItem & {
  checklists: ChecklistExecutionSummary[];
};

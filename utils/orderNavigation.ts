import { Routes } from '@/app/routes';
import type WorkOrder from '@/models/WorkOrder';

export function getOperationalRoute(status: string): string {
  if (status === '2') {
    return Routes.CHECKLIST_MAINTENANCE;
  }

  if (status === '3') {
    return Routes.CHECKLIST_DELIVERY;
  }

  return Routes.CHECKLIST_COLLECTION;
}

type WorkOrderRoutePayload = {
  operation_code: string;
  client: string;
  symptoms: string;
  chassi?: string;
  horimetro?: number;
  model?: string;
  date_in?: string;
  date_out?: string;
  status: string;
  status_sync: number;
  service?: string;
  insertDate?: string;
};

export function serializeWorkOrderParam(workOrder: WorkOrder): string {
  const payload: WorkOrderRoutePayload = {
    operation_code: workOrder.operation_code,
    client: workOrder.client,
    symptoms: workOrder.symptoms,
    chassi: workOrder.chassi,
    horimetro: workOrder.horimetro,
    model: workOrder.model,
    date_in: workOrder.date_in,
    date_out: workOrder.date_out,
    status: workOrder.status,
    status_sync: workOrder.status_sync,
    service: workOrder.service,
    insertDate: workOrder.insertDate,
  };

  return JSON.stringify(payload);
}

export function parseWorkOrderParam(payload?: string | string[] | null): WorkOrder | null {
  if (!payload) {
    return null;
  }

  const serialized = Array.isArray(payload) ? payload[0] : payload;

  if (!serialized) {
    return null;
  }

  try {
    const parsed = JSON.parse(serialized) as WorkOrderRoutePayload;

    return {
      operation_code: parsed.operation_code,
      client: parsed.client,
      symptoms: parsed.symptoms,
      chassi: parsed.chassi,
      horimetro: parsed.horimetro,
      model: parsed.model,
      date_in: parsed.date_in,
      date_out: parsed.date_out,
      status: parsed.status,
      status_sync: parsed.status_sync,
      service: parsed.service,
      insertDate: parsed.insertDate,
      signature_in: null,
      signature_out: null,
    };
  } catch {
    return null;
  }
}

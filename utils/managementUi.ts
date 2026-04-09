const STATUS_COLORS: Record<string, string> = {
  '1': '#f59e0b',
  '2': '#38bdf8',
  '3': '#22c55e',
  '4': '#94a3b8',
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  '1': 'Pendente',
  '2': 'Andamento',
  '3': 'Entrega',
  '4': 'Finalizada',
};

export function formatDateLabel(value?: string): string {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
}

export function getStatusColor(status: string | number): string {
  return STATUS_COLORS[String(status)] ?? '#2563eb';
}

export function getOrderStatusLabel(status: string | number): string {
  return ORDER_STATUS_LABELS[String(status)] ?? String(status);
}

export function getBooleanLabel(value: boolean, trueLabel: string, falseLabel: string): string {
  return value ? trueLabel : falseLabel;
}

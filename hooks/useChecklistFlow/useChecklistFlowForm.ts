import type { ChecklistStage, ChecklistStateItem } from '@/services/checklistFlow';
import { resolveChecklistDateChange } from '@/services/checklistFlow';
import { sanitizeOnlyNumbers } from '@/utils/validation';
import type WorkOrder from '@/models/WorkOrder';
import { useEffect, useState } from 'react';

type ChecklistFlowFormErrors = {
  chassi?: string;
  horimetro?: string;
  modelo?: string;
  signature?: string;
  items: Record<string, string>;
};

export default function useChecklistFlowForm(workOrder: WorkOrder | null) {
  const [openSignature, setOpenSignature] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [dateFilled, setDateFilled] = useState(workOrder?.date_in ? new Date(workOrder.date_in) : new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [chassi, setChassi] = useState(workOrder?.chassi ?? '');
  const [horimetro, setHorimetro] = useState<number>(Number(workOrder?.horimetro) || 0);
  const [horimetroInput, setHorimetroInput] = useState(workOrder?.horimetro ? String(workOrder.horimetro) : '');
  const [modelo, setModelo] = useState(workOrder?.model ?? '');
  const [formErrors, setFormErrors] = useState<ChecklistFlowFormErrors>({ items: {} });

  useEffect(() => {
    setDateFilled(workOrder?.date_in ? new Date(workOrder.date_in) : new Date());
    setChassi(workOrder?.chassi ?? '');
    setHorimetro(Number(workOrder?.horimetro) || 0);
    setHorimetroInput(workOrder?.horimetro ? String(workOrder.horimetro) : '');
    setModelo(workOrder?.model ?? '');
  }, [workOrder?.date_in, workOrder?.chassi, workOrder?.horimetro, workOrder?.model]);

  function updateChassi(value: string) {
    setChassi(value);
    setFormErrors((current) => ({ ...current, chassi: undefined }));
  }

  function updateHorimetroInput(value: string) {
    const sanitized = sanitizeOnlyNumbers(value);
    setHorimetroInput(sanitized);
    setHorimetro(sanitized ? Number(sanitized) : 0);
    setFormErrors((current) => ({ ...current, horimetro: undefined }));
  }

  function updateModelo(value: string) {
    setModelo(value);
    setFormErrors((current) => ({ ...current, modelo: undefined }));
  }

  function updateSignature(value: string) {
    setSignature(value);
    setFormErrors((current) => ({ ...current, signature: undefined }));
  }

  function clearItemError(itemId: string, value: string | null) {
    if (!value) {
      return;
    }

    setFormErrors((current) => {
      const nextItems = { ...current.items };
      delete nextItems[itemId];

      return {
        ...current,
        items: nextItems,
      };
    });
  }

  function onChange(_event: unknown, selectedDate?: Date) {
    setOpenCalendar(false);
    const nextDate = resolveChecklistDateChange(selectedDate);

    if (nextDate) {
      setDateFilled(nextDate);
    }
  }

  function validateBeforeSave(stage: ChecklistStage, checklistState: ChecklistStateItem[]): boolean {
    const nextErrors: ChecklistFlowFormErrors = { items: {} };

    if (stage === 'collection') {
      if (!chassi.trim()) {
        nextErrors.chassi = 'Campo obrigatorio';
      }

      if (!horimetroInput.trim()) {
        nextErrors.horimetro = 'Campo obrigatorio';
      }

      if (!modelo.trim()) {
        nextErrors.modelo = 'Campo obrigatorio';
      }

      for (const item of checklistState) {
        if (!item.selected) {
          nextErrors.items[item.id] = 'Campo obrigatorio';
        }
      }
    }

    if (!signature.trim()) {
      nextErrors.signature = 'Campo obrigatorio';
    }

    setFormErrors(nextErrors);

    return !nextErrors.chassi
      && !nextErrors.horimetro
      && !nextErrors.modelo
      && !nextErrors.signature
      && Object.keys(nextErrors.items).length === 0;
  }

  return {
    dateFilled,
    setDate: setDateFilled,
    openCalendar,
    setOpen: setOpenCalendar,
    chassi,
    setChassi: updateChassi,
    horimetro,
    setHorimetro,
    horimetroInput,
    setHorimetroInput: updateHorimetroInput,
    modelo,
    setModelo: updateModelo,
    signature,
    setSignature: updateSignature,
    setOpenSignature,
    openSignature,
    formErrors,
    clearItemError,
    onChange,
    validateBeforeSave,
  };
}

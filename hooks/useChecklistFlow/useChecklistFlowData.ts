import CheckListItem from '@/models/CheckListItem';
import WorkOrder from '@/models/WorkOrder';
import CheckListItemReposytory from '@/repository/CheckListItemRepository';
import CheckListRepository from '@/repository/CheckListRepository';
import WorkOrderRepository from '@/repository/WorkOrderRepository';
import {
  buildChecklistPayload as buildChecklistPayloadService,
  ChecklistSavePayload,
  ChecklistStage,
  ChecklistStateItem,
  hydrateChecklistState as hydrateChecklistStateService,
  saveChecklistData,
  saveChecklistItems as saveChecklistItemsService,
  saveWorkOrderData as saveWorkOrderDataService,
} from '@/services/checklistFlow';
import { executeControllerTask } from '@/services/core/controllerErrorService';
import { takePhoto as takePhotoService } from '@/services/core/imageService';
import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';

export { ChecklistSavePayload, ChecklistStage } from '@/services/checklistFlow';

export type ChecklistFlowPayloadFields = {
  dateFilled: Date;
  chassi: string;
  horimetro: number;
  modelo: string;
  signature: string;
};

export default function useChecklistFlowData() {
  const route = useRoute();
  const { workOrder } = route.params as { workOrder: WorkOrder };

  const [loadedWorkOrder, setLoadedWorkOrder] = useState<WorkOrder | null>(workOrder ?? null);
  const [checklistItems, setChecklistItems] = useState<CheckListItem[]>([]);
  const [checklistState, setChecklistState] = useState<ChecklistStateItem[]>([]);
  const [checkListRepositor, setCheckListRepository] = useState<CheckListRepository>();
  const [workOrderRepository, setWorkOrderRepository] = useState<WorkOrderRepository>();

  useEffect(() => {
    setLoadedWorkOrder(workOrder ?? null);
  }, [workOrder]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      await executeControllerTask(async () => {
        const nextWorkOrderRepository = await WorkOrderRepository.build();
        const nextCheckListRepository = await CheckListRepository.build();
        const checkListItemRepository = await CheckListItemReposytory.build();

        if (!isMounted) {
          return;
        }

        setWorkOrderRepository(nextWorkOrderRepository);
        setCheckListRepository(nextCheckListRepository);

        const data = await checkListItemRepository.getAll();
        const filteredData = data.filter((item) => item.status !== 0);

        if (!isMounted) {
          return;
        }

        setChecklistItems(filteredData);
      }, {
        operation: 'carregar checklist',
      });
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!workOrder?.operation_code) {
      return;
    }

    let cancelled = false;

    (async () => {
      await executeControllerTask(async () => {
        const repo = await WorkOrderRepository.build();
        const loaded = await repo.getById(workOrder.operation_code);

        if (!cancelled && loaded) {
          setLoadedWorkOrder(loaded);
        }
      }, {
        operation: 'carregar ordem de servico do checklist',
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [workOrder]);

  const displayOrder = loadedWorkOrder ?? workOrder;

  useEffect(() => {
    let cancelled = false;

    async function hydrateChecklistState() {
      await executeControllerTask(async () => {
        if (!checkListRepositor || checklistItems.length === 0) {
          return;
        }

        const hydratedState = await hydrateChecklistStateService(
          checkListRepositor,
          checklistItems,
          displayOrder.operation_code
        );

        if (cancelled) {
          return;
        }

        setChecklistState(hydratedState);
      }, {
        operation: 'carregar estado do checklist',
      });
    }

    hydrateChecklistState();

    return () => {
      cancelled = true;
    };
  }, [checkListRepositor, checklistItems, displayOrder.operation_code]);

  const deliveryChecklistItems = useMemo(
    () => checklistItems.filter((item) => {
      const state = checklistState.find((checklistItemState) => checklistItemState.id === item.id);
      return state?.selected != null;
    }),
    [checklistItems, checklistState]
  );

  function setItemSelected(id: string, value: string | null) {
    setChecklistState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: value } : item
      )
    );
  }

  function setItemPhotoInUri(id: string, uri: string) {
    setChecklistState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoInUri: uri, hasPhotoIn: true } : item
      )
    );
  }

  function setItemPhotoOutUri(id: string, uri: string) {
    setChecklistState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoOutUri: uri, hasPhotoOut: true } : item
      )
    );
  }

  const saveWorkOrderData = async (checklist: ChecklistSavePayload) => {
    if (!workOrderRepository) {
      throw new Error('WorkOrderRepository not initialized');
    }

    await saveWorkOrderDataService(workOrderRepository, checklist);
  };

  const saveChecklistItems = async (checklist: ChecklistSavePayload) => {
    if (!checkListRepositor) {
      throw new Error('CheckListRepository not initialized');
    }

    await saveChecklistItemsService(checkListRepositor, checklist);
  };

  const saveData = async (checklist: ChecklistSavePayload) => {
    if (!workOrderRepository) {
      throw new Error('WorkOrderRepository not initialized');
    }

    if (!checkListRepositor) {
      throw new Error('CheckListRepository not initialized');
    }

    await saveChecklistData(workOrderRepository, checkListRepositor, checklist);
  };

  const buildChecklistPayload = (
    stage: ChecklistStage,
    formValues: ChecklistFlowPayloadFields,
    currentWorkOrder: WorkOrder = displayOrder
  ): ChecklistSavePayload =>
    buildChecklistPayloadService({
      stage,
      workOrder: currentWorkOrder,
      checklistState,
      chassi: formValues.chassi,
      horimetro: formValues.horimetro,
      modelo: formValues.modelo,
      dateFilled: formValues.dateFilled,
      signature: formValues.signature,
    });

  const takePhoto = async (itemID: string, target: 'in' | 'out' = 'in') => {
    const uri = await executeControllerTask(async () => {
      const nextUri = await takePhotoService();

      if (!nextUri) {
        return null;
      }

      return nextUri;
    }, {
      operation: 'capturar foto',
    });

    if (!uri) {
      return;
    }

    if (target === 'in') {
      setItemPhotoInUri(itemID, uri);
    } else {
      setItemPhotoOutUri(itemID, uri);
    }
  };

  return {
    workOrder,
    displayOrder,
    checklistItems,
    deliveryChecklistItems,
    checklistState,
    setChecklistState,
    setItemSelected,
    setItemPhotoInUri,
    setItemPhotoOutUri,
    saveWorkOrderData,
    saveChecklistItems,
    saveData,
    buildChecklistPayload,
    takePhoto,
  };
}

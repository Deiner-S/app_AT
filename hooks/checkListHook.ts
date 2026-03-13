import CheckList from '@/models/CheckList';
import CheckListItem from '@/models/CheckListItem';
import WorkOrder from '@/models/WorkOrder';
import CheckListItemReposytory from '@/repository/CheckListItemRepository';
import CheckListRepository from '@/repository/CheckListRepository';
import WorkOrderRepository from '@/repository/WorkOrderRepository';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

interface ChecklistStateItem {
  id: string;
  checklistId?: string;
  selected: string | null;
  photoInUri: string | null;
  photoOutUri: string | null;
  hasPhotoIn: boolean;
  hasPhotoOut: boolean;
}

export type ChecklistStage = "collection" | "delivery";

type ChecklistWorkOrderUpdatePayload =
  Partial<Pick<WorkOrder, "chassi" | "horimetro" | "model" | "date_in" | "date_out" | "status" | "service">> & {
    signature_in?: string;
    signature_out?: string;
  };

export interface ChecklistItemPayload {
  checklist_id?: string;
  checklist_item_fk: string;
  status: string | null;
  photoInUri: string | null;
  photoOutUri: string | null;
}

export interface ChecklistSavePayload {
  stage: ChecklistStage;
  workOrder: WorkOrder;
  workOrderUpdate?: ChecklistWorkOrderUpdatePayload;
  items: ChecklistItemPayload[];
}

export default function useCheckListHook(){
  const route = useRoute();
  const { workOrder } = route.params as { workOrder: WorkOrder };

    const [openSignature, setOpenSignature] = useState(false);

    const [signature, setSignature] = useState<string>("")
    const [dateFilled, setDateFilled] = useState(workOrder?.date_in ? new Date(workOrder.date_in) : new Date());
    const [openCalendar, setOpenCalendar] = useState(false);
    const [chassi, setChassi] = useState(workOrder?.chassi ?? "");
    const [horimetro, setHorimetro] = useState<number>(Number(workOrder?.horimetro) || 0);
    const [modelo, setModelo] = useState(workOrder?.model ?? "");
    
    const [checklistItems, setChecklistItems] = useState<CheckListItem[]>([]);
    const [checklistState, setChecklistState] = useState<ChecklistStateItem[]>([]);
    
    const [checkListRepositor, setCheckListRepository] = useState<CheckListRepository>()
    const [workOrderRepository, setWorkOrderRepository] = useState<WorkOrderRepository>()

    useEffect(() => {
      
      let isMounted = true;
      
      async function init() {
        const workOrderRepository = await WorkOrderRepository.build();
        const checkListRepository = await CheckListRepository.build();
        const checkListItemRepository = await CheckListItemReposytory.build();

        if (!isMounted) return;

        setWorkOrderRepository(workOrderRepository);
        setCheckListRepository(checkListRepository);

        const data = await checkListItemRepository.getAll();
        const filteredData = data.filter(item => item.status !== 0);

        if (!isMounted) return;
        setChecklistItems(filteredData);
      }
      init();

      return () => {
        isMounted = false;
      };
    }, []);

    useEffect(() => {
      let cancelled = false;

      async function hydrateChecklistState() {
        if (!checkListRepositor || checklistItems.length === 0) return;

        const existingRows = await checkListRepositor.getAll();
        const existingByItem = new Map(
          existingRows
            .filter((row) => row.work_order_fk === workOrder.operation_code)
            .map((row) => [row.checklist_item_fk, row])
        );

        if (cancelled) return;

        setChecklistState(
          checklistItems.map((item) => {
            const existing = existingByItem.get(item.id);
            return {
              id: item.id,
              checklistId: existing?.id,
              selected: existing?.status ?? null,
              photoInUri: null,
              photoOutUri: null,
              hasPhotoIn: !!existing?.img_in,
              hasPhotoOut: !!existing?.img_out,
            };
          })
        );
      }

      hydrateChecklistState();

      return () => {
        cancelled = true;
      };
    }, [checkListRepositor, checklistItems, workOrder.operation_code]);


    
    function setItemSelected(id: string, value: string | null) {
      setChecklistState(prev =>
        prev.map(item =>
          item.id === id ? { ...item, selected: value } : item
        )
      );
    }

    function setItemPhotoInUri(id: string, uri: string) {
      setChecklistState(prev =>
        prev.map(item =>
          item.id === id ? { ...item, photoInUri: uri, hasPhotoIn: true } : item
        )
      );
    }

    function setItemPhotoOutUri(id: string, uri: string) {
      setChecklistState(prev =>
        prev.map(item =>
          item.id === id ? { ...item, photoOutUri: uri, hasPhotoOut: true } : item
        )
      );
    }
    function base64ToUint8Array(base64: string): Uint8Array {
      
      const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
      const binary = atob(cleanBase64);
      const len = binary.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      return bytes;
    }

    async function readImageAsUint8Array(uri: string): Promise<Uint8Array> {
          const response = await fetch(uri);
          const blob = await response.blob();

          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              const buffer = reader.result as ArrayBuffer;
              resolve(new Uint8Array(buffer));
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
          });
        }

    const saveWorkOrderData = async (checklist: ChecklistSavePayload) => {
      if (!workOrderRepository) {
        throw new Error("WorkOrderRepository not initialized");
      }

      if (!checklist.workOrderUpdate) {
        return;
      }

      const {
        signature_in,
        signature_out,
        ...workOrderUpdate
      } = checklist.workOrderUpdate;

      await workOrderRepository.update({
        ...checklist.workOrder,
        ...workOrderUpdate,
        status_sync: 0,
        signature_in: signature_in
          ? await base64ToUint8Array(signature_in)
          : checklist.workOrder.signature_in,
        signature_out: signature_out
          ? await base64ToUint8Array(signature_out)
          : checklist.workOrder.signature_out,
      });
    };

    const saveChecklistItems = async (checklist: ChecklistSavePayload) => {
      if (!checkListRepositor) {
        throw new Error("CheckListRepository not initialized");
      }

      const checklistRows = await checkListRepositor.getAll();
      const rowsByItem = new Map(
        checklistRows
          .filter((row) => row.work_order_fk === checklist.workOrder.operation_code)
          .map((row) => [row.checklist_item_fk, row])
      );

      for (const item of checklist.items) {
        const existing = rowsByItem.get(item.checklist_item_fk);
        const resolvedStatus = item.status ?? existing?.status;

        if (!resolvedStatus) {
          continue;
        }

        const resolvedImgIn = item.photoInUri
          ? await readImageAsUint8Array(item.photoInUri)
          : existing?.img_in ?? null;
        const resolvedImgOut = item.photoOutUri
          ? await readImageAsUint8Array(item.photoOutUri)
          : existing?.img_out ?? null;

        const nextChecklist: CheckList = {
          id: existing?.id ?? item.checklist_id ?? uuidv4(),
          checklist_item_fk: item.checklist_item_fk,
          work_order_fk: checklist.workOrder.operation_code,
          status_sync: 0,
          status: resolvedStatus,
          img_in: resolvedImgIn,
          img_out: resolvedImgOut,
        };

        if (existing) {
          await checkListRepositor.update(nextChecklist);
        } else {
          await checkListRepositor.save(nextChecklist);
        }
      }
    };

    const saveData = async (checklist: ChecklistSavePayload) => {
      await saveWorkOrderData(checklist);
      await saveChecklistItems(checklist);
    };

    const buildChecklistPayload = (
      stage: ChecklistStage,
      currentWorkOrder: WorkOrder = workOrder
    ): ChecklistSavePayload => ({
      stage,
      workOrder: currentWorkOrder,
      workOrderUpdate: stage === "collection"
        ? {
            chassi,
            horimetro,
            model: modelo,
            date_in: dateFilled.toISOString(),
            status: "2",
            signature_in: signature,
          }
        : {
            date_out: new Date().toISOString(),
            status: "4",
            signature_out: signature,
          },
      items: checklistState.map((item) => ({
        checklist_id: item.checklistId,
        checklist_item_fk: item.id,
        status: item.selected,
        photoInUri: stage === "collection" ? item.photoInUri : null,
        photoOutUri: stage === "delivery" ? item.photoOutUri : null,
      })),
    });




  function onChange(_event: any, selectedDate?: Date) {
    setOpenCalendar(false);
    if (selectedDate) setDateFilled(selectedDate);
  }

  const takePhoto = async (itemID:string, target: "in" | "out" = "in") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permission.granted) return alert("Permita acesso à câmera.");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled) {
      if (target === "in") {
        setItemPhotoInUri(itemID, result.assets[0].uri);
      } else {
        setItemPhotoOutUri(itemID, result.assets[0].uri);
      }
    }
  }
  //aqui precisamos fazer um readall do banco que contem o conjunto de checklist a serem feitos
  

  return{
    dateFilled, setDate: setDateFilled,openCalendar, setOpen: setOpenCalendar,
    chassi, setChassi,horimetro,setHorimetro,
    modelo, setModelo, checklistState, setChecklistState,
    setItemSelected, setItemPhotoInUri, setItemPhotoOutUri, workOrder,
    saveWorkOrderData, saveChecklistItems,
    saveData,buildChecklistPayload,onChange,takePhoto, checklistItems,
    signature, setSignature,setOpenSignature,openSignature 
  }


}
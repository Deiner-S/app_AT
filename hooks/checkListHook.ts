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
  id: number;
  selected: string | null;
  photoUri: string | null;
}

export default function useCheckListHook(){
    const [openSignature, setOpenSignature] = useState(false);

    const [signature, setSignature] = useState<string>("")
    const [dateFilled, setDateFilled] = useState(new Date());
    const [openCalendar, setOpenCalendar] = useState(false);
    const [chassi, setChassi] = useState("");
    const [horimetro, setHorimetro] = useState<number>(0);
    const [modelo, setModelo] = useState("");

    const route = useRoute();
    const { workOrder } = route.params as { workOrder: WorkOrder };
    
    const [checklistItems, setChecklistItems] = useState<CheckListItem[]>([]);
    const [checklistState, setChecklistState] = useState<ChecklistStateItem[]>([]);
    
    const [checkListRepositor, setCheckListRepository] = useState<CheckListRepository>()
    const [workOrderRepository, setWorkOrderRepository] = useState<WorkOrderRepository>()
    useEffect(()=>{

        

    })

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
      setChecklistState(
        checklistItems.map(item => ({
          id: item.id,
          selected: null,
          photoUri: null,
        }))
      );
    }, [checklistItems]);


    
    function setItemSelected(id: number, value: string | null) {
      setChecklistState(prev =>
        prev.map(item =>
          item.id === id ? { ...item, selected: value } : item
        )
      );
    }

    function setItemPhotoUri(id: number, uri: string) {
      setChecklistState(prev =>
        prev.map(item =>
          item.id === id ? { ...item, photoUri: uri } : item
        )
      );
    }
    function base64ToUint8Array(base64: string): Uint8Array {
      console.log("consegui ?")
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

    const saveData = async () => {
      console.log("saveData")
      workOrderRepository?.update({
          operation_code:workOrder.operation_code,
          client:workOrder.client,
          symptoms:workOrder.symptoms,
          chassi:chassi,
          horimetro:horimetro,
          model:modelo,
          date_in:dateFilled.toISOString(),
          date_out: undefined,
          status:"2",
          status_sync: 0,
          service: undefined,
          signature: await base64ToUint8Array(signature)

      })
      for (const checkList of checklistState){
        if(checkList.selected && checkList.photoUri){
          const novo_checklist: CheckList = {            
            id:uuidv4(),
            checklist_item_fk:checkList.id,
            work_order_fk: workOrder.operation_code,
            status_sync: 0,
            status: checkList.selected,
            img: await readImageAsUint8Array(checkList.photoUri),          
          }
          checkListRepositor?.save(novo_checklist)
        }
      }
      console.log("Salvo")
    }




  function onChange(_event: any, selectedDate?: Date) {
    setOpenCalendar(false);
    if (selectedDate) setDateFilled(selectedDate);
  }

  const takePhoto = async (itemID:number) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permission.granted) return alert("Permita acesso à câmera.");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled)
      setItemPhotoUri(itemID, result.assets[0].uri);
  }
  //aqui precisamos fazer um readall do banco que contem o conjunto de checklist a serem feitos
  

  return{
    dateFilled, setDate: setDateFilled,openCalendar, setOpen: setOpenCalendar,
    chassi, setChassi,horimetro,setHorimetro,
    modelo, setModelo, checklistState, setChecklistState,
    setItemSelected, setItemPhotoUri, workOrder,
    saveData,onChange,takePhoto, checklistItems,setSignature,setOpenSignature,openSignature 
  }


}
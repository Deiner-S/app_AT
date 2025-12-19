import CheckListItem from '@/models/CheckListItem';
import WorkOrder from '@/models/WorkOrder';
import CheckListItemReposytory from '@/repository/CheckListItemRepository';
import CheckListRepository from '@/repository/CheckListRepository';
import WorkOrderRepository from '@/repository/WorkOrderRepository';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";

interface ChecklistStateItem {
  id: number;
  selected: string | null;
  photoUri: string | null;
}

export default function useCheckListController(){

    const [dateFilled, setDateFilled] = useState(new Date());
    const [openCalendar, setOpenCalendar] = useState(false);
    const [chassi, setChassi] = useState("");
    const [orimento, setOrimento] = useState("");
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


    const saveData = () => {

      workOrderRepository?.update({
          operation_code:workOrder.operation_code,
          client:workOrder.client,
          symptoms:workOrder.symptoms,
          chassi:,
          orimento:,
          model:,
          date_in:,
          date_out:,
          status:"Andamento",
          service:,
          insert_date:,

      })
      console.log('Salvo')
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
    chassi, setChassi,orimento, setOrimento,
    modelo, setModelo, checklistState, setChecklistState,
    setItemSelected, setItemPhotoUri, workOrder,
    saveData,onChange,takePhoto, checklistItems
  }


}
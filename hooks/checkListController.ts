import Check from '@/models/Check';
import CheckReposytory from '@/repository/CheckRepository';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
interface ChecklistStateItem {
  id: number;
  selected: string | null;
  photoUri: string | null;
}

export default function useCheckListController(){

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [chassi, setChassi] = useState("");
    const [orimento, setOrimento] = useState("");
    const [modelo, setModelo] = useState("");
    const [operation_code, setOperation_code] = useState("");
    const [symptoms,setSymptoms] = useState("");
    const [client,setClient] = useState("");
    
    const [checklistItems, setChecklistItems] = useState<Check[]>([]);
    const [checklistState, setChecklistState] = useState<ChecklistStateItem[]>([]);
    
    useEffect(() => {
      
      async function loadChecklist() {
        const checkReposytory = await CheckReposytory.build()
        const data: Check[] = await checkReposytory.getAll();
        setChecklistItems(data);
      }

      loadChecklist();
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
      console.log('Salvo')
    }


  function onChange(_event: any, selectedDate?: Date) {
    setOpen(false);
    if (selectedDate) setDate(selectedDate);
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
    date, setDate,open, setOpen,
    chassi, setChassi,orimento, setOrimento,
    modelo, setModelo, checklistState, setChecklistState,
    setItemSelected, setItemPhotoUri,operation_code, 
    symptoms,client,saveData,onChange,takePhoto, checklistItems
  }


}
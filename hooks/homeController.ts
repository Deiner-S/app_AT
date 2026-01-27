import { useAuth } from "@/contexts/authContext";
import WorkOrder from "@/models/WorkOrder";
import WorkOrderRepository from "@/repository/WorkOrderRepository";
import Synchronizer from "@/services/synchronizerService";
import { useEffect, useState } from "react";




export default function useHomeController(){
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const { tokens: token } = useAuth()
    const loadWorkOrders = async () => {
          const workOrderRepository = await WorkOrderRepository.build();
          const data: WorkOrder[] = await workOrderRepository.getAll();
          const filteredData = await data.filter(item => item.status === "1");
          setWorkOrders(filteredData);
        }

    useEffect(() => {
      async function init(){
        try{
          if (!token) throw new Error('AUTH_TOKEN_MISSING')
          const synchronizer = await Synchronizer.build(token.access)
          await synchronizer.run()
          loadWorkOrders()
        }catch(err){
          console.error('Erro no sync', err)
        }
        
      }
      init()       
    },[]);
    
    return {
        workOrders,reload: loadWorkOrders
    }
}
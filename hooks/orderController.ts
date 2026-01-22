import WorkOrder from "@/models/WorkOrder";
import WorkOrderRepository from "@/repository/WorkOrderRepository";
import Synchronizer from "@/services/synchronizerService";
import { useEffect, useState } from "react";




export default function useOrderController(){
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    
    const loadWorkOrders = async () => {
          const workOrderRepository = await WorkOrderRepository.build();
          const data: WorkOrder[] = await workOrderRepository.getAll();
          const filteredData = await data.filter(item => item.status === "1");
          setWorkOrders(filteredData);
        }

    useEffect(() => {
      async function init(){
        const synchronizer = await Synchronizer.build()
        await synchronizer.run()
        loadWorkOrders()
      }
      init()       
    },[]);
    
    return {
        workOrders,reload: loadWorkOrders
    }
}
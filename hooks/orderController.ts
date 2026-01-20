import WorkOrder from "@/models/WorkOrder";
import WorkOrderRepository from "@/repository/WorkOrderRepository";
import Synchronizer from "@/services/synchronizerService";
import { useEffect, useState } from "react";




export default function useOrderController(){
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    
      useEffect(() => {
       
        async function loadWorkOrders() {
          const synchronizer = await Synchronizer.build()
          await synchronizer.run()
          const workOrderRepository = await WorkOrderRepository.build();
          const data: WorkOrder[] = await workOrderRepository.getAll();
          const filteredData = await data.filter(item => item.status === "1");
          setWorkOrders(filteredData);
        }
        loadWorkOrders();
      }, []);
    
    return {
        workOrders
    }
}
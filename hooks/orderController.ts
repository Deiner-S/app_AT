import WorkOrder from "@/models/WorkOrder";
import WorkOrderRepository from "@/repository/WorkOrderRepository";
import { syncPendingOrders } from "@/services/synchronizerService";
import { useEffect, useState } from "react";




export default function useOrderController(){
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    
      useEffect(() => {
        async function loadWorkOrders() {
          const workOrderRepository = await WorkOrderRepository.build();
          const data: WorkOrder[] = await workOrderRepository.getAll();
          const filteredData = data.filter(item => item.status === "Pendente");
          setWorkOrders(filteredData);
        }
        syncPendingOrders();
        loadWorkOrders();
      }, []);
    
    return {
        workOrders
    }
}
import CheckListItem from "@/models/CheckListItem";
import WorkOrder from "@/models/WorkOrder";
import CheckListItemRepository from "@/repository/CheckListItemRepository";
import CheckListRepository from '@/repository/CheckListRepository';
import WorkOrderRepository from "@/repository/WorkOrderRepository";
import { hasWebAccess, httpRequest } from "@/services/networkService";


// tasks
// - polish exception handling
// - evaluate dividing the file into more specialized files
// - Add a retry system to requests.

export default class Synchronizer{
    private baseUrl = "https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador"

    
    private constructor() {}
    static async build(): Promise<Synchronizer> {
        const instance = new Synchronizer();
        return instance;
    }
    public async run(): Promise<void>{
        if(await hasWebAccess()){
            console.log("sinc1")
            await this.receivePendingOrders("/send_work_orders_api/")
            console.log("sinc2")
            await this.receiveCheckListItems("/send_checklist_items_api/")
            console.log("sinc3")
            await this.sendWorkOrders("/receive_work_orders_api/")
            console.log("sinc4")
            await this.sendCheckListsFilleds("/receive_checklist_api/")
        }else{
            console.log("throw Error no network")
        }
    }

    private async receivePendingOrders(endPoint:string) {        
        const workOrders = await httpRequest<WorkOrder[]>({
            method: 'GET',
            endpoint: endPoint,
            BASE_URL: this.baseUrl
        })
        
        if(!workOrders){
            console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
        }
        
        const workOrderRepository = await WorkOrderRepository.build()
        for(const workOrder of workOrders){            
            const response = await workOrderRepository.getById(workOrder.operation_code)
            if(!response){
                console.log(workOrder.status_sync)
                workOrder.status_sync = 1
                await workOrderRepository.save(workOrder)
                console.log(workOrder)
            }
                    
        }
        
    }

    private async receiveCheckListItems(endPoint:string){        
        const checklistItemList = await httpRequest<CheckListItem[]>({
            method: 'GET',
            endpoint: endPoint,
            BASE_URL: this.baseUrl
        })

        if(!checklistItemList){
            console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
        }
        
        const checkListItemRepository = await CheckListItemRepository.build();
        await checkListItemRepository.deletAll()
        for(const item of checklistItemList){
            await checkListItemRepository.save(item)        
        }           
    }

    private async sendWorkOrders(endPoint:string){   
        const workOrderRepository = await WorkOrderRepository.build()
        const workOrders = await workOrderRepository.getAll()
        const workOrdersFiltered = await workOrders.filter(item => item.status_sync !== 1)

        if (workOrdersFiltered.length === 0){
            console.log(`throw Error: empyt list:${endPoint}`)
         
        }else{    
        
            const response = await httpRequest<{ ok: boolean }>({
                method: 'POST',
                endpoint: endPoint,
                BASE_URL: this.baseUrl,
                body: workOrdersFiltered
            })
            
            if(response.ok){
                for(const workOrder of workOrdersFiltered){
                    workOrder.status_sync = 1
                    workOrderRepository.update(workOrder)
                }
            }else{
                console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
            }
        }

    }

    private async sendCheckListsFilleds(endPoint:string){
        const checkListRepository = await CheckListRepository.build()
        const checkLists = await checkListRepository.getAll()
        const checkListsFiltered = checkLists.filter(item => item.status_sync !== 1)

        if (checkListsFiltered.length === 0){
            console.log(`throw Error: empyt list:${endPoint}`)
        }else{       
            const response = await httpRequest<{ ok: boolean }>({
                    method: 'POST',
                    endpoint: endPoint,
                    BASE_URL: this.baseUrl,
                    body: checkListsFiltered
            })

            if(response.ok){
                for(const checkList of checkListsFiltered){
                    checkList.status_sync = 1
                    checkListRepository.update(checkList)
                }
            }else{
                console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
            }
        }
    }
}



 



    



import CheckList from '@/models/CheckList';
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
            await this.receivePendingOrders("/send_work_orders_api")
            await this.receiveCheckListItems("/send_checklist_items_api")
            //await this.sendWorkOrders("/receive_work_orders_api")
            //await this.sendCheckListsFilleds("/receive_checklist_api")
        }else{
            console.log("throw Error no network")
        }
    }

    private async receivePendingOrders(endPoint:string): Promise<void> {        
        const workOrders = await httpRequest<WorkOrder[]>({
            method: 'GET',
            endpoint: endPoint,
            BASE_URL: this.baseUrl
            })
        console.log("dados coletados api")
        if(!workOrders){
            console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
        }
        console.log("inicializando obj do banco")
        const workOrderRepository = await WorkOrderRepository.build()
        for(const workOrder of workOrders){
            console.log("efetuando operação")
            const response = await workOrderRepository.getById(workOrder.operation_code)
            if(!response){
                workOrderRepository.save(workOrder)
                console.log(workOrder)
            }
            console.log("operação realizada")        
        }
        
    }

    private async receiveCheckListItems(endPoint:string): Promise<void>{        
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
            console.log(item)
            await checkListItemRepository.save(item)        
        }
        
        console.log("Conteúdo:", checklistItemList)        
        
    }

    private async sendWorkOrders(endPoint:string): Promise<void>{   
        const workOrderRepository = await WorkOrderRepository.build()
        const workOrders = await workOrderRepository.getAll()
        const workOrdersFiltered = workOrders.filter(item => item.statusSync !== 1)

        const response = await httpRequest<WorkOrder[]>({
            method: 'POST',
            endpoint: endPoint,
            BASE_URL: this.baseUrl,
            body: workOrdersFiltered
        })

        if(response){
            for(const workOrder of workOrdersFiltered){
                workOrder.statusSync = 1
                workOrderRepository.update(workOrder)
            }
        }else{
            console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
        }

    }

    private async sendCheckListsFilleds(endPoint:string){
        const checkListRepository = await CheckListRepository.build()
        const checkLists = await checkListRepository.getAll()
        const checkListsFiltered = checkLists.filter(item => item.statusSync !== 1)


        const response = await httpRequest<CheckList[]>({
            method: 'POST',
            endpoint: endPoint,
            BASE_URL: this.baseUrl,
            body: checkListsFiltered
        })

        if(response){
            for(const checkList of checkListsFiltered){
                checkList.statusSync = 1
                checkListRepository.update(checkList)
            }
        }else{
            console.log(`throw Error: Failed to connect to endpoint:${endPoint}`)
        }

    }
}



 



    



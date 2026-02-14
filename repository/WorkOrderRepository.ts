import WorkOrder from "@/models/WorkOrder";
import BaseRepository from "./BaseRepository";

export default class WorkOrderRepository extends BaseRepository<WorkOrder> {

    constructor() {
    super(WorkOrder); // passa a classe
    }

    static async build() {
    const repo = new WorkOrderRepository();
    return repo.init();
    }
}

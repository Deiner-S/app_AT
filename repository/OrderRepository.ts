import WorkOrder from "@/models/WorkOrder";
import * as SQLite from "expo-sqlite";
import Repository from "./repository";
import tableInit from "./tableInit";

export default class OrderRepository implements Repository<WorkOrder,number>{
    
    db!: SQLite.SQLiteDatabase;
    
    constructor() {}
    
    static async build() {
        const instance = new OrderRepository();
        instance.db = await SQLite.openDatabaseAsync("app.db");
        await tableInit(instance.db);
        return instance;
    }
    
    async save(entity: WorkOrder): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getById(id: number): Promise<WorkOrder | null> {
        throw new Error("Method not implemented.");
    }
    async update(entity: WorkOrder): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<WorkOrder[]> {
        throw new Error("Method not implemented.");
    }   
    
}
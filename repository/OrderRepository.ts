import Repository from "./repository";
import Order from "@/models/Order";
import tableInit from "./tableInit";
import * as SQLite from "expo-sqlite";

export default class OrderRepository implements Repository<Order,number>{
    
    db!: SQLite.SQLiteDatabase;
    
    constructor() {}
    
    static async build() {
        const instance = new OrderRepository();
        instance.db = await SQLite.openDatabaseAsync("app.db");
        await tableInit(instance.db);
        return instance;
    }
    
    async save(entity: Order): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getById(id: number): Promise<Order | null> {
        throw new Error("Method not implemented.");
    }
    async update(entity: Order): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }   
    
}
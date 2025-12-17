import Check from "@/models/Check";
import * as SQLite from "expo-sqlite";
import Repository from "./repository";
import tableInit from "./tableInit";


export default class CheckReposytory implements Repository<Check,number> {

  db!: SQLite.SQLiteDatabase;

  constructor() {}
  
  static async build() {
      const instance = new CheckReposytory();
      instance.db = await SQLite.openDatabaseAsync("app.db");
      await tableInit(instance.db);
      return instance;
    }

  
  async save(data: Check): Promise<boolean> {
    const result = await this.db.runAsync(
      "INSERT INTO people (name, status) VALUES (?, ?)",
      [data.name, data.status]
    );

    return result.changes > 0;
  }
  
  async getById(id: number): Promise<Check | null> {
    const row = await this.db.getFirstAsync<Check>(
      "SELECT * FROM people WHERE id = ?",
      [id]
    );
    
    return row ?? null;
  }

  async update(data: Check): Promise<boolean> {
    const result = await this.db.runAsync(
      "UPDATE people SET name = ?, status = ? WHERE id = ?",
      [data.name, data.status, data.id]
    );
    
    return result.changes > 0;
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.db.runAsync(
      "DELETE FROM people WHERE id = ?",
      [id]
    );
    
    return result.changes > 0;
  }

  async getAll(): Promise<Check[]> {
    throw new Error("Method not implemented.");
  }
}

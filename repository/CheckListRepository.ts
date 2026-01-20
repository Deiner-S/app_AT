import CheckList from "@/models/CheckList";
import * as SQLite from "expo-sqlite";
import Database from "./dbInit";
import Repository from "./repository";

export default class CheckListRepository implements Repository<CheckList, number> {

  db!: SQLite.SQLiteDatabase;

  static async build() {
    const instance = new CheckListRepository();
    instance.db = await Database.getInstance();
    return instance;
  }

  async save(entity: CheckList): Promise<boolean> {
    try {
      const query = `
        INSERT INTO checklist 
        (checklist_item_fk, 
        work_order_fk, 
        status, 
        status_sync, 
        img)

        VALUES (?, ?, ?, ?, ?)
      `;

      await this.db.runAsync(query, [
        entity.checklist_fk,
        entity.serviceOrder_fk,
        entity.status,
        entity.img ?? null
      ]);

      return true;
    } catch (error) {
      console.error("CheckListRepository.save", error);
      return false;
    }
  }

  async getById(id: number): Promise<CheckList | null> {
    try {
      const query = `
        SELECT * FROM checklist WHERE id = ?
      `;

      const result = await this.db.getFirstAsync<CheckList>(query, [id]);
      return result ?? null;
    } catch (error) {
      console.error("CheckListRepository.getById", error);
      return null;
    }
  }

  async update(entity: CheckList): Promise<boolean> {
    if (!entity.id) return false;

    try {
      const query = `
        UPDATE checklist
        SET checklist_item_fk = ?, 
            work_order_fk = ?, 
            status = ?,
            status_sync =?
            img = ?
        WHERE id = ?
      `;

      await this.db.runAsync(query, [
        entity.checklist_fk,
        entity.serviceOrder_fk,
        entity.status,
        entity.status_sync ?? null,
        entity.img ?? null,
        entity.id
      ]);

      return true;
    } catch (error) {
      console.error("CheckListRepository.update", error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM checklist WHERE id = ?
      `;

      await this.db.runAsync(query, [id]);
      return true;
    } catch (error) {
      console.error("CheckListRepository.delete", error);
      return false;
    }
  }

  async getAll(): Promise<CheckList[]> {
    try {
      const query = `
        SELECT * FROM checklist
      `;

      const result = await this.db.getAllAsync<CheckList>(query);
      return result;
    } catch (error) {
      console.error("CheckListRepository.getAll", error);
      return [];
    }
  }
}

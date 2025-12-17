import CheckListItem from "@/models/CheckListItem";
import * as SQLite from "expo-sqlite";
import Repository from "./repository";
import tableInit from "./tableInit";

export default class CheckListItemRepository implements Repository<CheckListItem, number> {

  db!: SQLite.SQLiteDatabase;

  private constructor() {}

  static async build() {
    const instance = new CheckListItemRepository();
    instance.db = await SQLite.openDatabaseAsync("app.db");
    await tableInit(instance.db);
    return instance;
  }

  // CREATE
  async save(entity: CheckListItem): Promise<boolean> {
    const result = await this.db.runAsync(
      "INSERT INTO checklist_item (name, status) VALUES (?, ?)",
      [entity.name, entity.status]
    );

    return result.changes > 0;
  }

  // READ BY ID
  async getById(id: number): Promise<CheckListItem | null> {
    const row = await this.db.getFirstAsync<any>(
      "SELECT * FROM checklist_item WHERE id = ?",
      [id]
    );

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      status: row.status,
    };
  }

  // UPDATE
  async update(entity: CheckListItem): Promise<boolean> {
    const result = await this.db.runAsync(
      "UPDATE checklist_item SET name = ?, status = ? WHERE id = ?",
      [entity.name, entity.status, entity.id]
    );

    return result.changes > 0;
  }

  // DELETE
  async delete(id: number): Promise<boolean> {
    const result = await this.db.runAsync(
      "DELETE FROM checklist_item WHERE id = ?",
      [id]
    );

    return result.changes > 0;
  }

  // READ ALL
  async getAll(): Promise<CheckListItem[]> {
    const rows = await this.db.getAllAsync<any>(
      "SELECT * FROM checklist_item"
    );

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      status: row.status,
    }));
  }
}

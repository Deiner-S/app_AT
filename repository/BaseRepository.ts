import * as SQLite from "expo-sqlite";
import Database from "./dbInit";
import { ColumnDefinition } from "./types";
type OrmModel<T> = {
  table: string;
  schema: Record<string, ColumnDefinition>;
  new (...args: any[]): T;
};

export default abstract class BaseRepository<T> {
  protected db!: SQLite.SQLiteDatabase;
  protected Model: OrmModel<T>;

  protected constructor(Model: OrmModel<T>) {
    this.Model = Model;
  }

  async init() {
    this.db = await Database.getInstance();
    return this;
  }

  // ---------- helpers ----------
  protected columns() {    
    return Object.keys(this.Model.schema);
  }

  protected values(entity: Partial<T>) {
    return this.columns().map(col => (entity as any)[col]);
  }

  protected map(row: any): T {
    const args = this.columns().map(c => row[c]);
    return new this.Model(...args);
  }

  // ---------- CRUD ----------
  async getById(id: number): Promise<T | null> {
    const row = await this.db.getFirstAsync<any>(
      `SELECT * FROM ${this.Model.table} WHERE id = ?`,
      [id]
    );
    return row ? this.map(row) : null;
  }

  async getAll(): Promise<T[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM ${this.Model.table}`
    );
    return rows.map(r => this.map(r));
  }

  async save(entity: T): Promise<boolean> {
    const cols = this.columns();
    const placeholders = cols.map(() => "?").join(", ");

    const result = await this.db.runAsync(
      `INSERT INTO ${this.Model.table} (${cols.join(", ")})
       VALUES (${placeholders})`,
      this.values(entity)
    );

    return result.changes > 0;
  }

  async update(entity: T): Promise<boolean> {
    const cols = this.columns().filter(c => c !== "id");
    const set = cols.map(c => `${c} = ?`).join(", ");

    const values = cols.map(c => (entity as any)[c]);
    values.push((entity as any).id);

    const result = await this.db.runAsync(
      `UPDATE ${this.Model.table}
       SET ${set}
       WHERE id = ?`,
      values
    );

    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.runAsync(
      `DELETE FROM ${this.Model.table} WHERE id = ?`,
      [id]
    );
    return result.changes > 0;
  }
}


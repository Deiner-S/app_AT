import WorkOrder from "@/models/WorkOrder";
import * as SQLite from "expo-sqlite";
import Database from "./dbInit";
import Repository from "./repository";

export default class WorkOrderRepository implements Repository<WorkOrder, number> {

  db!: SQLite.SQLiteDatabase;

  constructor() {}

  static async build() {
    const instance = new WorkOrderRepository();
    instance.db = await Database.getInstance();
    return instance;
  }

  async save(entity: WorkOrder): Promise<boolean> {
    try {
      await this.db.runAsync(
        `
        INSERT INTO work_order (
          operation_code,
          client,
          symptoms,
          chassi,
          orimento,
          model,
          date_in,
          date_out,
          status,
          status_sync,
          img,
          service
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          entity.operation_code,
          entity.client,
          entity.symptoms ?? null,
          entity.chassi ?? null,
          entity.orimento ?? null,
          entity.model ?? null,
          entity.date_in ?? null,
          entity.date_out ?? null,
          entity.status ?? null,
          entity.status_sync ?? null,
          entity.img ?? null,
          entity.service ?? null
        ]
      );
      return true;
    } catch (error) {
      console.error("Erro ao salvar WorkOrder:", error);
      return false;
    }
  }

  async getById(id: number): Promise<WorkOrder | null> {
    try {
      const result = await this.db.getFirstAsync<WorkOrder>(
        `SELECT * FROM work_order WHERE operation_code = ?`,
        [String(id)]
      );
      return result ?? null;
    } catch (error) {
      console.error("Erro ao buscar WorkOrder:", error);
      return null;
    }
  }

  async update(entity: WorkOrder): Promise<boolean> {
    try {
      await this.db.runAsync(
        `
        UPDATE work_order SET
          client = ?,
          symptoms = ?,
          chassi = ?,
          orimento = ?,
          model = ?,
          date_in = ?,
          date_out = ?,
          status = ?,
          status_sync = ?,
          img = ?,
          service = ?
        WHERE operation_code = ?
        `,
        [
          entity.client,
          entity.symptoms ?? null,
          entity.chassi ?? null,
          entity.orimento ?? null,
          entity.model ?? null,
          entity.date_in ?? null,
          entity.date_out ?? null,
          entity.status ?? null,
          entity.status_sync,
          entity.img ?? null,
          entity.service ?? null,
          entity.operation_code
        ]
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar WorkOrder:", error);
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.runAsync(
        `DELETE FROM work_order WHERE operation_code = ?`,
        [String(id)]
      );
      return true;
    } catch (error) {
      console.error("Erro ao deletar WorkOrder:", error);
      return false;
    }
  }

  async getAll(): Promise<WorkOrder[]> {
    try {
      const result = await this.db.getAllAsync<WorkOrder>(
        `SELECT * FROM work_order ORDER BY insertDate DESC`
      );
      return result;
    } catch (error) {
      console.error("Erro ao listar WorkOrders:", error);
      return [];
    }
  }
}

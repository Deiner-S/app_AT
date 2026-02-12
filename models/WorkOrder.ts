import { ColumnDefinition } from "@/repository/types";

export default class WorkOrder{
  // 🔹 Nome da tabela derivado automaticamente
  static get table(): string {
    return this.name
      .replace(/[A-Z]/g, l => "_" + l.toLowerCase())
      .replace(/^_/, "");
  }
  // 🔹 Schema da tabela
  static schema: Record<string, ColumnDefinition> = {
    operation_code: { type: "INTEGER", primary: true },
    client: { type: "TEXT", notNull: true },
    symptoms: { type: "TEXT", notNull: true },
    chassi: { type: "TEXT" },
    horimetro: { type: "REAL" },
    model: { type: "TEXT" },
    date_in: { type: "TEXT" },
    date_out: { type: "TEXT" },
    status: { type: "TEXT", notNull: true },
    status_sync: { type: "INTEGER", notNull: true },
    service: { type: "TEXT" },
    signature: { type: "BLOB" },
    insertDate: { type: "TEXT" }
  };

  constructor(
    public operation_code: number,
    public client: string,
    public symptoms: string,
    public status: string,
    public status_sync: number,
    public chassi?: string,
    public horimetro?: number,
    public model?: string,
    public date_in?: string,
    public date_out?: string,
    public service?: string,
    public signature?: Uint8Array | null,
    public insertDate?: string,
  ) {}
}

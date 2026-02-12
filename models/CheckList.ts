import {ColumnDefinition} from "@/repository/types"


export default class CheckList{
  // 🔹 Nome da tabela derivado automaticamente
  static get table(): string {
    return this.name
      .replace(/[A-Z]/g, l => "_" + l.toLowerCase())
      .replace(/^_/, "");
  }
  // 🔹 Schema da tabela
  static schema: Record<string, ColumnDefinition> = {    
    id: { type: "TEXT", primary: true },
    checklist_item_fk: { type: "INTEGER", notNull: true },
    work_order_fk: { type: "INTEGER", notNull: true },
    status: { type: "TEXT", notNull: true },
    status_sync: { type: "INTEGER" },
    img: { type: "BLOB" }
  };

  constructor(
    public id: string,
    public checklist_item_fk:number,
    public work_order_fk:number,
    public status:string,
    public status_sync?: number,
    public img?: Uint8Array | null
  ) {}
}
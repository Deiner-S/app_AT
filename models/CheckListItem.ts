import {ColumnDefinition} from "@/repository/types"

export class CheckListItem {
  // 🔹 Nome da tabela derivado automaticamente
  static get table(): string {
    return this.name
      .replace(/[A-Z]/g, l => "_" + l.toLowerCase())
      .replace(/^_/, "");
  }
  // 🔹 Schema da tabela
  static schema: Record<string, ColumnDefinition> = {
    id: { type: "INTEGER", primary: true, autoIncrement: true },
    name: { type: "TEXT", notNull: true },
    status: {type: "INTEGER",notNull: true, default:0}
  };
  constructor(
    public id: number,
    public name: string,
    public status: number
  ) {}
}

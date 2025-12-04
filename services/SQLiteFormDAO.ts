
import * as SQLite from "expo-sqlite";
import Form from "../models/Form";
import DAO from "./DAO";

export default class SqliteFormDAO implements DAO<Form> {

  private db = SQLite.openDatabaseSync("localdb.db");

  async create(data: Form): Promise<boolean> {
    await this.db.execAsync(
      `INSERT INTO forms (nome, idade, ativo) VALUES ('${data.nome}', ${data.idade}, ${data.ativo ? 1 : 0})`,
    );

    return true;
  }

  async read(id: number): Promise<Form | null> {
    const row = await this.db.getFirstAsync<Form>(
      `SELECT * FROM forms WHERE id = ${id} LIMIT 1`
    );

    if (!row) { 
      return null;
    }

    return {
      id: row.id,
      nome: row.nome,
      idade: row.idade,
      ativo: (row as any).ativo === 1
    };
  }


  async update(id: number, data: Form): Promise<boolean> {
    await this.db.execAsync(
      `UPDATE forms 
      SET nome='${data.nome}', idade=${data.idade}, ativo=${data.ativo ? 1 : 0}
      WHERE id=${id}`
    );

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.db.execAsync(
      `DELETE FROM forms WHERE id = ${id}`
    );

    return true;
  }

  async readAll(){
    result = this.db.getAllSync(`SELECT * FROM people`);
    return result
  };
  

}
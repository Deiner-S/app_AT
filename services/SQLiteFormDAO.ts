
import * as SQLite from "expo-sqlite";
import Form from "../models/Form";
import DAO from "./DAO";

export default class SqliteFormDAO implements DAO<Form> {

  private db!: SQLite.SQLiteDatabase;

  constructor() {}

  static async build() {
        const instance = new SqliteFormDAO();
        await instance.init();
        return instance;
    }

  private async init() {
    this.db = await SQLite.openDatabaseAsync("app.db");
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        sinc INTEGER NOT NULL,
      );
    `);
  }
  
  async create(data: Form): Promise<boolean> {
    await this.db.execAsync(
      `INSERT INTO people (name, age, sinc) VALUES ('${data.name}', ${data.age}', ${data.sinc})`,);
    
    return true;
  }



  async read(id: number): Promise<Form | null> {
    const row = await this.db.getFirstAsync<Form>(
      `SELECT * FROM people WHERE id = ${id} LIMIT 1`
    );

    if (!row) { 
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      age: row.age,
      sinc: row.sinc
    };
  }


  async update(id: number, data: Form): Promise<boolean> {
    await this.db.execAsync(
      `UPDATE people 
      SET name='${data.name}', age=${data.age}, sinc=${data.age}
      WHERE id=${id}`
    );

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.db.execAsync(
      `DELETE FROM people WHERE id = ${id}`
    );

    return true;
  }

  async readAll(){ 
    console.log("teste")
    let result = await this.db.getAllAsync(`SELECT * FROM people`);
    console.log(result)
    return result as Form[]
  };
  

}
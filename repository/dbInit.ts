import * as any from "expo-sqlite";

//Singleton: garante que só exista uma instância do banco de dados
export default class Database {
  private static instance: any | null = null;

  private constructor() {} // impede instância direta

  static async getInstance(): Promise<any> {
    if (!Database.instance) {
      const db = await any.openDatabaseAsync("app.db");
      await tableInit(db);
      Database.instance = db;      
    }    
    return Database.instance;
  }
}


async function tableInit(db: any.SQLiteDatabase){
    db.execAsync(`
        DROP TABLE IF EXISTS checklist_item;
        DROP TABLE IF EXISTS work_order;
        DROP TABLE IF EXISTS checklist;
        
        CREATE TABLE IF NOT EXISTS checklist_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status INTEGER NOT NULL            
        );

        
        CREATE TABLE IF NOT EXISTS work_order (
            operation_code INTEGER PRIMARY KEY NOT NULL,
            client TEXT NOT NULL,
            symptoms TEXT NOT NULL,
            chassi TEXT UNIQUE,
            orimento TEXT,
            model TEXT,
            date_in TEXT,
            date_out TEXT,
            status TEXT NOT NULL,
            status_sync INTEGER DEFAULT 1,
            service TEXT,
            signature BLOB,
            insertDate TEXT
        );

        
        CREATE TABLE IF NOT EXISTS checklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            checklist_item_fk INTEGER NOT NULL,
            work_order_fk TEXT NOT NULL,
            status TEXT NOT NULL,
            status_sync INTEGER NOT NULL DEFAULT 0,
            img BLOB,
            
            FOREIGN KEY (work_order_fk) REFERENCES work_order(operation_code), 
            FOREIGN KEY (checklist_item_fk) REFERENCES checklist_item(id)
        );
            `
        );
}



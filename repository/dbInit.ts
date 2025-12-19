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
            operation_code TEXT PRIMARY KEY NOT NULL,
            client TEXT NOT NULL,
            symptoms TEXT NOT NULL,
            chassi TEXT UNIQUE,
            orimento TEXT,
            model TEXT,
            date_in TEXT,
            date_out TEXT,
            status TEXT NOT NULL,
            service TEXT,
            insert_date TEXT DEFAULT CURRENT_TIMESTAMP
        );

        
        CREATE TABLE IF NOT EXISTS checklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            checklist_item_fk INTEGER NOT NULL,
            work_order_fk TEXT NOT NULL,
            status TEXT NOT NULL,
            img BLOB,
            
            FOREIGN KEY (work_order_fk) REFERENCES work_order(operation_code), 
            FOREIGN KEY (checklist_item_fk) REFERENCES checklist_item(id)
        );

        
        INSERT INTO work_order (operation_code, client, symptoms, status) VALUES
        ('OS-001', 'João da Silva', 'Motor não liga', 'Pendente'),
        ('OS-002', 'Maria Oliveira', 'Barulho estranho ao frear', 'Pendente'),
        ('OS-003', 'Carlos Santos', 'Luz de injeção acesa', 'Pendente'),
        ('OS-004', 'Ana Pereira', 'Vibração excessiva em marcha lenta', 'Pendente'),
        ('OS-005', 'Pedro Almeida', 'Veículo perde força em subidas', 'Pendente');

        INSERT INTO checklist_item (id, name, status) VALUES 
        (1, 'LIMPEZA', 1),
        (2, 'PNEU F/D', 0),
        (3, 'PNEU F/E', 0),
        (4, 'PNEU T/D', 0),
        (5, 'PNEU T/E', 0),
        (6, 'CABINE', 0),
        (7, 'PARALAMA T/D', 0),
        (8, 'PARALAMA T/E', 0),
        (9, 'PARALAMA D/D', 0),
        (10, 'PARALAMA D/E', 0),
        (11, 'CAPÔ L/D', 0),
        (12, 'CAPÔ L/F', 0),
        (13, 'CAPÔ CIMA', 0),
        (14, 'VAZAMENTO MOTOR', 0),
        (15, 'VAZAMENTO TRANSMISÃO', 0),
        (16, 'FAROL DIANTEIRO CAPÔ', 0),
        (17, 'FAROL LATERAL D/CAPÔ', 0),
        (18, 'FAROL LATERAL E/CAPÔ', 0),
        (19, 'CONTRA PESO DIANTEIRO', 0),
        (20, 'CONTRA PESO TRASEIRO L/D', 0),
        (21, 'CONTRA PESO TRASEIRO L/E', 0),
        (22, 'PINO LEVANTE HIDRAULICO L/D', 0),
        (23, 'PINO LEVANTE HIDRAULICO L/E', 0),
        (24, 'PINO BARRA DE TRAÇÃO', 0),
        (25, 'PINO BARRA DE TRAÇÃO L/D', 0),
        (26, 'PINO BARRA DE TRAÇÃO L/E', 0),
        (27, 'TECLAS CABINE', 0),
        (28, 'PORTA L/D', 0),
        (29, 'PORTA L/E', 0),
        (30, 'PORTA LATERAL L/D', 0),
        (31, 'PORTA LATERAL L/E', 0),
        (32, 'PORTA TRASEIRA', 0),
        (33, 'PAINEL', 0),
        (34, 'BOZINA', 0),
        (35, 'LUZ ALTA', 0),
        (36, 'LUZ BAIXA', 0),
        (37, 'SETA F/D', 0),
        (38, 'SETA F/E', 0),
        (39, 'SETA T/D', 0),
        (40, 'SETA T/E', 0),
        (41, 'PISCA ALERTA', 0);
        
            `
        );
}



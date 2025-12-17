import * as SQLite from "expo-sqlite";


export default async function tableInit(db: SQLite.SQLiteDatabase){
    db.execAsync(`        
        CREATE TABLE IF NOT EXISTS checklist_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status INTEGER NOT NULL
        );

        
        CREATE TABLE IF NOT EXISTS work_order (
            operation_code TEXT PRIMARY KEY NOT NULL,
            client INTEGER NOT NULL,
            symptoms TEXT,
            chassi TEXT UNIQUE,
            orimento TEXT,
            model TEXT,
            date_in TEXT,
            date_out TEXT,
            status TEXT,
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

        /*
        INSERT INTO checklist_item (id, name, status) VALUES 
        (1, 'LIMPEZA', 1),
        (2, 'PNEU F/D', 1),
        (3, 'PNEU F/E', 1),
        (4, 'PNEU T/D', 1),
        (5, 'PNEU T/E', 1),
        (6, 'CABINE', 1),
        (7, 'PARALAMA T/D', 1),
        (8, 'PARALAMA T/E', 1),
        (9, 'PARALAMA D/D', 1),
        (10, 'PARALAMA D/E', 1),
        (11, 'CAPÔ L/D', 1),
        (12, 'CAPÔ L/F', 1),
        (13, 'CAPÔ CIMA', 1),
        (14, 'VAZAMENTO MOTOR', 1),
        (15, 'VAZAMENTO TRANSMISÃO', 1),
        (16, 'FAROL DIANTEIRO CAPÔ', 1),
        (17, 'FAROL LATERAL D/CAPÔ', 1),
        (18, 'FAROL LATERAL E/CAPÔ', 1),
        (19, 'CONTRA PESO DIANTEIRO', 1),
        (20, 'CONTRA PESO TRASEIRO L/D', 1),
        (21, 'CONTRA PESO TRASEIRO L/E', 1),
        (22, 'PINO LEVANTE HIDRAULICO L/D', 1),
        (23, 'PINO LEVANTE HIDRAULICO L/E', 1),
        (24, 'PINO BARRA DE TRAÇÃO', 1),
        (25, 'PINO BARRA DE TRAÇÃO L/D', 1),
        (26, 'PINO BARRA DE TRAÇÃO L/E', 1),
        (27, 'TECLAS CABINE', 1),
        (28, 'PORTA L/D', 1),
        (29, 'PORTA L/E', 1),
        (30, 'PORTA LATERAL L/D', 1),
        (31, 'PORTA LATERAL L/E', 1),
        (32, 'PORTA TRASEIRA', 1),
        (33, 'PAINEL', 1),
        (34, 'BOZINA', 1),
        (35, 'LUZ ALTA', 1),
        (36, 'LUZ BAIXA', 1),
        (37, 'SETA F/D', 1),
        (38, 'SETA F/E', 1),
        (39, 'SETA T/D', 1),
        (40, 'SETA T/E', 1),
        (41, 'PISCA ALERTA', 1);
        */
            `
        );
}

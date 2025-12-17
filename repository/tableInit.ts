import * as SQLite from "expo-sqlite";


export default async function tableInit(db: SQLite.SQLiteDatabase){
    db.execAsync(`
        -- 1. CRIAÇÃO DA TABELA 'check' (Itens do Checklist Mestre)
        CREATE TABLE IF NOT EXISTS check (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status INTEGER NOT NULL
        );

        -- 2. CRIAÇÃO DA TABELA 'Order' (Ordem de Serviço)
        CREATE TABLE Order (
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

        -- 3. CRIAÇÃO DA TABELA 'checklist' (Respostas do Checklist por Ordem de Serviço)
        CREATE TABLE IF NOT EXISTS checklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            check_fk INTEGER NOT NULL,
            serviceOrder_fk TEXT NOT NULL,
            status TEXT NOT NULL,
            img BLOB,
            
            FOREIGN KEY (serviceOrder_fk) REFERENCES Order(operation_code), 
            FOREIGN KEY (check_fk) REFERENCES check(id)
        );

        -- 4. INSERÇÃO NA TABELA 'check' (41 itens)
        INSERT INTO check (id, name, status) VALUES 
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

            -- 5. INSERÇÃO NA TABELA 'Order' (5 Ordens de Serviço de Exemplo com STATUS ajustado)
            INSERT INTO Order (operation_code, client, symptoms, chassi, orimento, model, date_in, date_out, status, service) VALUES
            ('OS-00001', 101, 'Motor falhando e aquecendo.', '9BH429188T0001234', 'OR-12345', 'Trator A7500', '2025-12-15 08:00:00', NULL, 'EM ANDAMENTO', 'Revisão Motor'),      -- Checklist Preenchido
            ('OS-00002', 102, 'Vazamento óleo hidráulico no pino.', '9BH429188T0005678', 'OR-12346', 'Retro B8000', '2025-12-15 10:30:00', NULL, 'EM ANDAMENTO', 'Reparo Hidráulico'),     -- Checklist Preenchido
            ('OS-00003', 103, 'Pneu furado e luzes não acendem.', '9BH429188T0009999', 'OR-12347', 'Colheitadeira C9000', '2025-12-16 13:45:00', '2025-12-16 17:00:00', 'CONCLUIDA', 'Troca Pneu e Elétrica'), -- Concluída (mesmo com checklist)
            ('OS-00004', 104, 'Barulho estranho na transmissão.', '9BH429188T0011111', 'OR-12348', 'Trator D6000', '2025-12-16 15:20:00', NULL, 'PENDENTE', 'Avaliação Transmissão'),      -- Sem Checklist
            ('OS-00005', 105, 'Manutenção preventiva padrão.', '9BH429188T0022222', 'OR-12349', 'Pulverizador E5500', '2025-12-16 18:00:00', NULL, 'PENDENTE', 'Manutenção Geral');       -- Sem Checklist

            -- 6. INSERÇÃO NA TABELA 'checklist' (Respostas para OS-00001)
            INSERT INTO checklist (check_fk, serviceOrder_fk, status, img) VALUES
            (1, 'OS-00001', 'bom', NULL), (2, 'OS-00001', 'bom', NULL), (3, 'OS-00001', 'mediano', NULL),
            (4, 'OS-00001', 'ruim', NULL), (5, 'OS-00001', 'bom', NULL), (6, 'OS-00001', 'bom', NULL),
            (7, 'OS-00001', 'bom', NULL), (8, 'OS-00001', 'mediano', NULL), (9, 'OS-00001', 'bom', NULL),
            (10, 'OS-00001', 'bom', NULL), (11, 'OS-00001', 'bom', NULL), (12, 'OS-00001', 'ruim', NULL), 
            (13, 'OS-00001', 'bom', NULL), (14, 'OS-00001', 'ruim', NULL), (15, 'OS-00001', 'bom', NULL),
            (16, 'OS-00001', 'bom', NULL), (17, 'OS-00001', 'bom', NULL), (18, 'OS-00001', 'mediano', NULL),
            (19, 'OS-00001', 'bom', NULL), (20, 'OS-00001', 'bom', NULL), (21, 'OS-00001', 'bom', NULL),
            (22, 'OS-00001', 'bom', NULL), (23, 'OS-00001', 'bom', NULL), (24, 'OS-00001', 'bom', NULL),
            (25, 'OS-00001', 'bom', NULL), (26, 'OS-00001', 'bom', NULL), (27, 'OS-00001', 'bom', NULL),
            (28, 'OS-00001', 'bom', NULL), (29, 'OS-00001', 'bom', NULL), (30, 'OS-00001', 'bom', NULL),
            (31, 'OS-00001', 'bom', NULL), (32, 'OS-00001', 'bom', NULL), (33, 'OS-00001', 'bom', NULL),
            (34, 'OS-00001', 'bom', NULL), (35, 'OS-00001', 'bom', NULL), (36, 'OS-00001', 'bom', NULL),
            (37, 'OS-00001', 'bom', NULL), (38, 'OS-00001', 'bom', NULL), (39, 'OS-00001', 'bom', NULL),
            (40, 'OS-00001', 'bom', NULL), (41, 'OS-00001', 'bom', NULL);

            -- 7. INSERÇÃO NA TABELA 'checklist' (Respostas para OS-00002: Pinos de Levante Ruim, Outros Bom)
            INSERT INTO checklist (check_fk, serviceOrder_fk, status, img)
            SELECT 
                id, 
                'OS-00002', 
                CASE id
                    WHEN 22 THEN 'ruim' 
                    WHEN 23 THEN 'ruim' 
                    ELSE 'bom'
                END AS status,
                NULL AS img
            FROM check;

            -- 8. INSERÇÃO NA TABELA 'checklist' (Respostas para OS-00003: Todos Mediano)
            INSERT INTO checklist (check_fk, serviceOrder_fk, status, img)
            SELECT 
                id, 
                'OS-00003', 
                'mediano', 
                NULL AS img
            FROM check;
            
            `
        );
}

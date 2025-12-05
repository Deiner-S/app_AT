import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import Person from "../models/person";
import DAO from "./DAO";

export default class SqlitePersonDAO implements DAO<Person> {

    private db!: Database;

    private constructor() {}

    static async build() {
        const instance = new SqlitePersonDAO();
        await instance.init();
        return instance;
    }

    private async init() {
        this.db = await open({
            filename: "./database.db",
            driver: sqlite3.Database
        });

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS people (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER
            );
        `);
    }

    async create(data: Person): Promise<boolean> {
        await this.db.run(
            `INSERT INTO people (name, age) VALUES (?, ?)`,
            [data.name, data.age]
        );
        return true;
    }

    async read(id: number): Promise<Person | null> {
        const row = await this.db.get(`SELECT * FROM people WHERE id = ?`, [id]);
        return row ?? null;
    }

    async update(id: number, data: Person): Promise<boolean> {
        const result = await this.db.run(
            `UPDATE people SET name = ?, age = ? WHERE id = ?`,
            [data.name, data.age, id]
        );
        return (result.changes ?? 0) > 0;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.db.run(
            `DELETE FROM people WHERE id = ?`,
            [id]
        );
        return (result.changes ?? 0) > 0;
    }
}

export default interface DAO<T> {
    create(data: T): Promise<boolean>;
    read(id: number): Promise<T | null>;
    update(id: number, data: T): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}


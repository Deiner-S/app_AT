import DAO from "@/DAO/DAO";
import Check from "@/models/Check";

class CheckService implements DAO<Check>{


    


    create(data: Check): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    read(id: number): Promise<Check | null> {
        throw new Error("Method not implemented.");
    }
    update(id: number, data: Check): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }


}
import CheckList from "@/models/CheckList";
import BaseRepository from "./BaseRepository";


export default class CheckListRepository extends BaseRepository<CheckList>{

    constructor() {
        super(CheckList); // passa a classe
      }
    
      static async build() {
        const repo = new CheckListRepository();
        return repo.init();
      }
}

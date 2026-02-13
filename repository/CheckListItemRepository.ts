import CheckListItem from "@/models/CheckListItem";
import BaseRepository from "./BaseRepository";
export default class CheckListItemRepository extends BaseRepository<CheckListItem> {

  
  constructor() {
    super(CheckListItem); // passa a classe
  }

  static async build() {
    const repo = new CheckListItemRepository();
    return repo.init();
  }

}

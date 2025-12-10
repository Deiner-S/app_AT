import Form from "@/models/Form";
import SqliteFormDAO from "@/services/SQLiteFormDAO";
import { useEffect, useState } from "react";

export default function formController() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [items, setItems] = useState<Form[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dao, setFormDAO] = useState<SqliteFormDAO | null>(null);


  useEffect(() => {
  async function init() {
      const dao = await SqliteFormDAO.build();
      setFormDAO(dao);

      const rows = await dao.readAll();
      setItems(rows);
  }    
  init();
  }, []);

  const saveData = async () => {
    console.log("save")
      if (!dao) return;
      await dao.create({
        name: name,
        age: Number(age),
        sinc: 0
      });

      const rows = await dao.readAll();
      setItems(rows);
      //reset()
    };

    const updateData = async () => {
      console.log("update")
      if (!dao || !selectedId) return;
      await dao.update(
        selectedId,{
        name: name,
        age: Number(age),
        sinc: 0
      })
      const rows = await dao.readAll();
      setItems(rows);
      //reset()
    }
    
    const deleteData = async () => {
      console.log("delete")
      if (!dao || !selectedId) return;

      await dao.delete(selectedId);

      const rows = await dao.readAll();
      setItems(rows);
      //reset()
    };

    /*function reset() {
      console.log("reset")
      setName("");
      setAge("");
      setItems([]);
      setSelectedId(null);
    }*/

  return {
  name, setName,
  age, setAge,
  items, setItems,
  selectedId, setSelectedId,
  dao, setFormDAO,
  deleteData,
  updateData,
  saveData,
  };
}

import Form from "@/models/Form";
import SqliteFormDAO from "@/services/SQLiteFormDAO";
import { useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, TextInput, View } from "react-native";

export default function Index() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [items, setItems] = useState<Form[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formDAO, setFormDAO] = useState<SqliteFormDAO | null>(null);

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
    if (!formDAO) return;
    await formDAO.create({
      name: name,
      age: Number(age),
    });

    const rows = await formDAO.readAll();
    setItems(rows);
  };

  const updateData = async () => {
    if (!formDAO || !selectedId) return;
    await formDAO.update(
      selectedId,{
      name: name,
      age: Number(age),
    })
    const rows = await formDAO.readAll();
    setItems(rows);
  }
  
  const deleteData = async () => {
    if (!formDAO || !selectedId) return;

    await formDAO.delete(selectedId);

    const rows = await formDAO.readAll();
    setItems(rows);
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Cadastro Local
      </Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        placeholder="Idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={saveData} />
      <Button title="Atualizar" onPress={updateData} />
      <Button title="Deletar" onPress={deleteData} />

      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Registros salvos:
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;

          return (
            <Pressable onPress={() => setSelectedId(item.id!)}>
              <View style={{
                padding: 12,
                marginVertical: 6,
                borderRadius: 8,
                backgroundColor: isSelected ? "#cce5ff" : "#fff",
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? "#3399ff" : "#ccc",
              }}>
                <Text style={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : "#333",
                }}>
                  {item.name} — {item.age} anos
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

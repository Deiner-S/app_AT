import { useEffect, useState } from "react";
import { Text, TextInput, View, Button, FlatList } from "react-native";
import * as SQLite from "expo-sqlite";

// abre (ou cria) o banco local
const db = SQLite.openDatabaseSync("localdb.db");

export default function Index() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [items, setItems] = useState([]);

  // cria tabela uma vez
  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
      );
    `);
    loadData();
  }, []);

  // carrega dados
  const loadData = () => {
    const result = db.getAllSync(`SELECT * FROM people`);
    setItems(result);
  };

  // insere dados
  const saveData = () => {
    if (!name || !age) return;

    db.runSync(
      `INSERT INTO people (name, age) VALUES (?, ?)`,
      [name, Number(age)]
    );

    setName("");
    setAge("");
    loadData();
  };

  // (Futuro) Sincronizar com API
  const syncData = () => {
    // aqui você vai bater no backend Django
    // pegar os itens "pendentes" do SQLite
    // enviar via POST
    // e marcar como sincronizados
    console.log("Função de sync pronta pra integrar com Django 💙");
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Cadastro Local
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8
        }}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8
        }}
        placeholder="Idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={saveData} />

      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Registros salvos:
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} — {item.age} anos</Text>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Sincronizar com servidor" onPress={syncData} />
      </View>
    </View>
  );
}

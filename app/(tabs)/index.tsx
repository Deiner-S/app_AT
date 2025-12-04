import Form from "@/models/Form";
import SqliteFormDAO from "@/services/SqliteFormDAO";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";


export default function Index() {
  const [name, setName] = useState(""); //tipo um GET
  const [age, setAge] = useState("");
  const [items, setItems] = useState([]);

  const formDAO = new SqliteFormDAO();

  const newForm: Form = {
    nome: name,
    idade: Number(age),
    ativo: true
  };


  useEffect(() => {
    const carregarDados = async () => {
      const dados = await formDAO.readAll(); // supondo que você crie um método readAll no DAO
      setItems(dados); // setForms é useState para lista de forms
  };

    carregarDados();
  }, []);

  const saveData = () => {
    formDAO.create(newForm)    
  }

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

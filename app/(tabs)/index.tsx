import useFormController from "@/hooks/FormController";
import useFormSyncController from "@/hooks/formSyncController";
import { Button, FlatList, Pressable, Text, TextInput, View } from "react-native";
;



export default function Index() {

  const form = useFormController()
  const sync = useFormSyncController(form.dao)
  

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Cadastro Local
      </Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        placeholder="Nome"
        value={form.name}
        onChangeText={form.setName}
      />

      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
        placeholder="Idade"
        value={form.age}
        onChangeText={form.setAge}
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={form.saveData} />
      <Button title="Atualizar" onPress={form.updateData} />
      <Button title="Deletar" onPress={form.deleteData} />
      <Button title="Sincronizar" onPress={sync.sincData} />
      <Text style={{ marginTop: 20, fontSize: 18 }}>
        Registros salvos:
      </Text>

      <FlatList
        data={form.items}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => {
          const isSelected = item.id === form.selectedId;

          return (
            <Pressable onPress={() => form.setSelectedId(item.id!)}>
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
                  {item.name} — {item.age} anos - {item.sinc}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Proxima() {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [chassi, setChassi] = useState("");
    const [orimento, setOrimento] = useState("");
    const [modelo, setModelo] = useState("");
    
    const operation_code = "OS-45872";
    const symptoms = "Equipamento não liga ao pressionar o botão.";
    const client = "Empresa Atlas Tecnologia – Unidade SP";

    const saveData = () => {
      console.log('Salvo')
    }


  function onChange(_event: any, selectedDate?: Date) {
    setOpen(false);
    if (selectedDate) setDate(selectedDate);
  }

  return (
  <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Cliente:</Text>
        <Text style={styles.text}>{client}</Text>
        <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Ordem de Serviço:</Text>
        <Text style={styles.text}>{operation_code}</Text>
        <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Problema relatado:</Text>
        <Text style={styles.text}>{symptoms}</Text>
        <TextInput
          style={styles.input}
          placeholder="Chassi"
          placeholderTextColor="#8e8e93"
          value={chassi}
          onChangeText={setChassi}
        />
        <TextInput
          style={styles.input}
          placeholder="Orimento"
          placeholderTextColor="#8e8e93"
          value={orimento}
          onChangeText={setOrimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          placeholderTextColor="#8e8e93"
          value={modelo}
          onChangeText={setModelo}
        />
                <TextInput
          style={styles.input}
          placeholder="Chassi"
          placeholderTextColor="#8e8e93"
          value={chassi}
          onChangeText={setChassi}
        />
        <TextInput
          style={styles.input}
          placeholder="Orimento"
          placeholderTextColor="#8e8e93"
          value={orimento}
          onChangeText={setOrimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          placeholderTextColor="#8e8e93"
          value={modelo}
          onChangeText={setModelo}
        />
                <TextInput
          style={styles.input}
          placeholder="Chassi"
          placeholderTextColor="#8e8e93"
          value={chassi}
          onChangeText={setChassi}
        />
        <TextInput
          style={styles.input}
          placeholder="Orimento"
          placeholderTextColor="#8e8e93"
          value={orimento}
          onChangeText={setOrimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          placeholderTextColor="#8e8e93"
          value={modelo}
          onChangeText={setModelo}
        />
        

        <Pressable
          onPress={() => setOpen(true)}
          style={{
            backgroundColor: "#2e3238",
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#3a3f45",
          }}
          >
          <Text style={{ color: "#fff" }}>
            {date.toLocaleDateString("pt-BR")}
          </Text>
        </Pressable>

        {open && (
          <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          />
        )}
      </View>
      <View>
        <Button title="Salvar" onPress={saveData}></Button>
      </View>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingHorizontal: 24,
    paddingTop: 32,
    
  },

  content: {
    flex: 1,
    gap: 16,
  },
  text:{
    color: "#ccc",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#3a3f45',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#2e3238',
    color: '#fff',
    fontSize: 16,

    // leve profundidade (suave e elegante)
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});


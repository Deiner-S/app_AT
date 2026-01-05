import ChecklistBox from '@/components/checkListBox';
import HeaderOS from '@/components/HeaderOS';
import useCheckListController from '@/hooks/checkListController';
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckList() {
  
  const checkList = useCheckListController()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <HeaderOS
            client={checkList.workOrder.client}
            operation_code={checkList.workOrder.operation_code}
            symptoms={checkList.workOrder.symptoms}
            chassi={checkList.chassi}
            setChassi={checkList.setChassi}
            orimento={checkList.orimento}
            setOrimento={checkList.setOrimento}
            modelo={checkList.modelo}
            setModelo={checkList.setModelo}
            dateFilled={checkList.dateFilled}
            openCalendar={checkList.openCalendar}
            setOpen={checkList.setOpen}
            onChange={checkList.onChange}
          />

          <View style={styles.divider} />
          
          {checkList.checklistItems.map(item => (
            <ChecklistBox
              key={item.id}
              checkList={item.name}
              selected={checkList.checklistState.find(i => i.id === item.id)?.selected ?? null}
              setSelected={(value) => checkList.setItemSelected(item.id, value)}
              handleTakePhoto={() => checkList.takePhoto(item.id)}
              photoUri={checkList.checklistState.find(i => i.id === item.id)?.photoUri ?? null}
            />
          ))}

          <View style={styles.content}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed
                ]}
                onPress={checkList.saveData}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </View>

      </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingHorizontal: 24,
    paddingTop: 32,    
  },
  
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // levemente opaca
    borderRadius: 2,
    marginVertical: 12,
  },

  content: {
    padding: 16,
    alignItems: "center",
  },

  button: {
    width: "100%",
    maxWidth: 320,
    height: 52,

    backgroundColor: "#2563EB", // azul elegante
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});


import ChecklistItem from '@/components/checkListBox';
import HeaderOS from '@/components/headerOS';
import useCheckListController from '@/hooks/checkListController';
import React from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
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
            dateFilled={checkList.date}
            openCalendar={checkList.open}
            setOpen={checkList.setOpen}
            onChange={checkList.onChange}
          />

          <View style={styles.divider} />
          
          {checkList.checklistItems.map(item => (
            <ChecklistItem
              key={item.id}
              checkList={item.name}
              selected={checkList.checklistState.find(i => i.id === item.id)?.selected ?? null}
              setSelected={(value) => checkList.setItemSelected(item.id, value)}
              handleTakePhoto={() => checkList.takePhoto(item.id)}
              photoUri={checkList.checklistState.find(i => i.id === item.id)?.photoUri ?? null}
            />
          ))}

          <View style={styles.content}>
            <Button title="Salvar" onPress={checkList.saveData}></Button>
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
  content: {
    flex:1,
    gap: 16,
    padding:6
  },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // levemente opaca
    borderRadius: 2,
    marginVertical: 12,
  },
});


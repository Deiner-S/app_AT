import AppShell from "@/components/appShell/AppShell";
import ChecklistBox from "@/components/checklistComponents/checkListBox";
import HeaderOS from "@/components/checklistComponents/HeaderOS";
import Signature from "@/components/checklistComponents/signature";
import { useSync } from "@/contexts/syncContext";
import useCheckListHook from "@/hooks/checkListHook";
import { executeControllerTask } from "@/services/controllerErrorService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Routes } from "../routes";

export default function CheckList() {
  const checkList = useCheckListHook();
  const navigation = useNavigation<any>();
  const { runSync } = useSync();
  const hasSignature = !!checkList.signature;

  async function handleSave() {
    await executeControllerTask(async () => {
      const checklistPayload = checkList.buildChecklistPayload("collection");
      await checkList.saveData(checklistPayload);
      await runSync();
      navigation.navigate(Routes.HOME);
    }, {
      operation: "salvar checklist",
    });
  }

  return (
    <AppShell
      title="Checklist de coleta"
      subtitle={`OS ${checkList.workOrder.operation_code} - ${checkList.workOrder.client}`}
    >
      <View style={styles.content}>
        <HeaderOS
          client={checkList.workOrder.client}
          operation_code={checkList.workOrder.operation_code}
          symptoms={checkList.workOrder.symptoms}
          chassi={checkList.chassi}
          setChassi={checkList.setChassi}
          orimento={checkList.horimetro}
          setOrimento={(value) => checkList.setHorimetro(Number(value) || 0)}
          modelo={checkList.modelo}
          setModelo={checkList.setModelo}
          dateFilled={checkList.dateFilled}
          openCalendar={checkList.openCalendar}
          setOpen={checkList.setOpen}
          onChange={checkList.onChange}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Itens de avaliacao</Text>
          <Text style={styles.sectionSubtitle}>
            Preencha o estado de conservacao e anexe foto quando necessario.
          </Text>
        </View>

        {checkList.checklistItems.map((item) => (
          <ChecklistBox
            key={item.id}
            checkList={item.name}
            selected={checkList.checklistState.find((stateItem) => stateItem.id === item.id)?.selected ?? null}
            setSelected={(value) => checkList.setItemSelected(item.id, value)}
            handleTakePhoto={() => checkList.takePhoto(item.id, "in")}
            photoButtonLabel="Foto"
            photoAttached={
              (checkList.checklistState.find((stateItem) => stateItem.id === item.id)?.hasPhotoIn ?? false) ||
              !!checkList.checklistState.find((stateItem) => stateItem.id === item.id)?.photoInUri
            }
          />
        ))}

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Assinatura</Text>
          <Text style={styles.actionDescription}>
            {hasSignature
              ? "Checklist assinado e pronto para envio."
              : "Capture a assinatura antes de concluir o checklist."}
          </Text>
          <Pressable
            disabled={hasSignature}
            style={({ pressed }) => [
              styles.signatureButton,
              hasSignature && styles.signatureButtonDone,
              !hasSignature && pressed && styles.signatureButtonPressed,
            ]}
            onPress={() => {
              if (!hasSignature) checkList.setOpenSignature(true);
            }}
          >
            <View style={styles.signatureContent}>
              {hasSignature ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#14532d"
                  style={styles.signatureIcon}
                />
              ) : null}
              <Text style={styles.buttonText}>{hasSignature ? "Assinado" : "Assinar"}</Text>
            </View>
          </Pressable>
        </View>

        <Modal visible={checkList.openSignature} animationType="slide">
          <Signature
            setSignature={checkList.setSignature}
            onClose={() => checkList.setOpenSignature(false)}
          />
        </Modal>

        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Salvar checklist</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 8,
  },
  actionCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    marginTop: 4,
    marginBottom: 14,
  },
  actionTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "700",
  },
  actionDescription: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 14,
  },
  signatureButton: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#FDE68A",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  signatureButtonDone: {
    backgroundColor: "#4ade80",
  },
  signatureButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  signatureContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signatureIcon: {
    marginRight: 8,
  },
  submitButton: {
    width: "100%",
    minHeight: 54,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  submitButtonPressed: {
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

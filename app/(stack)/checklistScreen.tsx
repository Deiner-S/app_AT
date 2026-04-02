import AppShell from "@/components/appShell/AppShell";
import ChecklistBox from "@/components/checklistComponents/checkListBox";
import Signature from "@/components/checklistComponents/signature";
import { useSync } from "@/contexts/syncContext";
import useCheckListHook from "@/hooks/checkListHook";
import { executeControllerTask } from "@/services/controllerErrorService";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Routes } from "../routes";
import {
  sanitizeOnlyLettersAndNumbers,
  sanitizeOnlyNumbers,
} from "@/utils/validation";

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
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Problema relatado</Text>
          <Text style={styles.problemText}>{checkList.workOrder.symptoms}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Preenchimento inicial</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Chassi</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe o chassi"
              placeholderTextColor="#64748b"
              value={checkList.chassi}
              onChangeText={(value) => checkList.setChassi(sanitizeOnlyLettersAndNumbers(value).toUpperCase())}
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Horimetro</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe o horimetro"
              placeholderTextColor="#64748b"
              value={String(checkList.horimetro ?? "")}
              onChangeText={(value) => checkList.setHorimetro(Number(sanitizeOnlyNumbers(value)) || 0)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe o modelo"
              placeholderTextColor="#64748b"
              value={checkList.modelo}
              onChangeText={(value) => checkList.setModelo(sanitizeOnlyLettersAndNumbers(value))}
            />
          </View>

          <View>
            <Text style={styles.label}>Data</Text>
            <Pressable
              onPress={() => checkList.setOpen(true)}
              style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed]}
            >
              <Text style={styles.dateText}>{checkList.dateFilled.toLocaleDateString("pt-BR")}</Text>
            </Pressable>
          </View>
        </View>

        {checkList.openCalendar ? (
          <DateTimePicker
            value={checkList.dateFilled}
            mode="date"
            display="default"
            onChange={checkList.onChange}
          />
        ) : null}

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
  infoCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    marginBottom: 14,
  },
  formCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },
  problemText: {
    color: "#e2e8f0",
    backgroundColor: "rgba(30, 41, 59, 0.82)",
    padding: 14,
    borderRadius: 16,
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    color: "#f8fafc",
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  dateButtonPressed: {
    opacity: 0.88,
  },
  dateText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
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

import ChecklistBox from '@/components/checklistComponents/checkListBox';
import HeaderOSReadOnly from '@/components/checklistComponents/HeaderOSReadOnly';
import Signature from '@/components/checklistComponents/signature';
import { useSync } from '@/contexts/syncContext';
import useCheckListHook from '@/hooks/checkListHook';
import { Ionicons } from '@expo/vector-icons';
import { executeControllerTask } from '@/services/controllerErrorService';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from '../routes';

export default function DeliveryChecklistScreen() {
  const checkList = useCheckListHook();
  const navigation = useNavigation<any>();
  const { runSync } = useSync();
  const insets = useSafeAreaInsets();
  const displayOrder = checkList.displayOrder;
  const hasSignature = !!checkList.signature;

  async function handleSave() {
    await executeControllerTask(async () => {
      const checklistPayload = checkList.buildChecklistPayload('delivery', displayOrder);
      await checkList.saveData(checklistPayload);
      await runSync();
      navigation.navigate(Routes.HOME);
    }, {
      operation: 'salvar checklist de entrega',
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 24 + Math.max(insets.top, 0) * 0.2,
            paddingBottom: 40 + Math.max(insets.bottom, 16),
          },
        ]}
      >
        <HeaderOSReadOnly workOrder={displayOrder} />

        <View style={styles.divider} />

        {checkList.checklistItems.map((item) => (
          <ChecklistBox
            key={item.id}
            checkList={item.name}
            selected={checkList.checklistState.find((i) => i.id === item.id)?.selected ?? null}
            readOnlyStatus
            handleTakePhoto={() => checkList.takePhoto(item.id, 'out')}
            photoButtonLabel="Foto"
            photoAttached={
              (checkList.checklistState.find((i) => i.id === item.id)?.hasPhotoOut ?? false) ||
              !!checkList.checklistState.find((i) => i.id === item.id)?.photoOutUri
            }
          />
        ))}

        <View style={styles.signatureWrapper}>
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
              {hasSignature && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#14532d"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={styles.buttonText}>
                {hasSignature ? 'Entrega assinada' : 'Assinar entrega'}
              </Text>
            </View>
          </Pressable>
        </View>

        <Modal visible={checkList.openSignature} animationType="slide">
          <Signature
            setSignature={checkList.setSignature}
            onClose={() => checkList.setOpenSignature(false)}
          />
        </Modal>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Salvar checklist de entrega</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    paddingHorizontal: 24,
    gap: 12,
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginVertical: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  signatureWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  signatureButton: {
    width: '100%',
    maxWidth: 320,
    height: 52,
    backgroundColor: '#FDE68A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signatureButtonDone: {
    backgroundColor: '#4ade80',
  },
  signatureButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  signatureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    width: '100%',
    maxWidth: 320,
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

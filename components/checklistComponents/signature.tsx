import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
type Props = {
  setSignature: (signature: string) => void;
  onClose: () => void;
};

export default function Signature({ setSignature,onClose }: Props) {
  const signatureRef = useRef<any>(null);


  function handleSave(sig: string) {
    setSignature(sig);
    onClose(); // fecha modal
  }

  return (
    <View style={{ flex: 1 }}>
      <SignatureScreen
        ref={signatureRef}
        onOK={handleSave}
        onEmpty={() => console.log("Assinatura vazia")}
        descriptionText="Assine acima"
        clearText="Limpar"
        confirmText="Salvar"
        webStyle={`
          .m-signature-pad--footer {
            display: none;
          }
        `}
      />
      <View style={styles.actions}>
        {/* Cancelar */}
        <Pressable onPress={onClose}>
          <AntDesign name="close-circle" size={36} color="#DC2626" />
        </Pressable>

        {/* Limpar */}
        <Pressable onPress={() => signatureRef.current?.clearSignature()}>
          <MaterialIcons name="refresh" size={36} color="#FACC15" />
        </Pressable>

        {/* Salvar */}
        <Pressable onPress={() => signatureRef.current.readSignature()}>
          <Feather name="check-circle" size={36} color="#16A34A" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
  },
});


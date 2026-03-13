import { useRequestLoading } from '@/contexts/requestLoadingContext';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function RequestLoadingOverlay() {
  const { isRequestLoading } = useRequestLoading();

  if (!isRequestLoading) {
    return null;
  }

  return (
    <View pointerEvents="auto" style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    zIndex: 999,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchProductByBarcode } from '@/services/barcodeService';

export default function BarcodeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScanPress = () => {
    // Navigate to full-screen scanner
    router.push('/(app)/scanner' as any);
  };

  const handleManualSubmit = async () => {
    const trimmed = manualBarcode.trim();
    if (trimmed.length < 8) {
      Alert.alert('Invalid Barcode', 'Please enter a valid barcode (at least 8 digits).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchProductByBarcode(trimmed);
      setShowManualInput(false);
      setManualBarcode('');

      router.push({
        pathname: '/(app)/scan-result',
        params: {
          barcode: trimmed,
          found: result.found ? 'true' : 'false',
          product: result.product ? JSON.stringify(result.product) : '',
          ingredientsText: result.ingredientsText || '',
        },
      } as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to look up product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Product Check</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scanFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <View style={styles.scanInner}>
            <Ionicons name="barcode-outline" size={80} color="#7A9E9F" />
            <Text style={styles.scanText}>Position barcode here</Text>
          </View>
        </View>

        <Text style={styles.title}>Check Product Safety</Text>
        <Text style={styles.subtitle}>
          Scan any skincare product barcode to get{'\n'}a personalized compatibility score
        </Text>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
          <LinearGradient
            colors={['#A8C5C6', '#7A9E9F']}
            style={styles.scanButtonGradient}
          >
            <Ionicons name="camera" size={22} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={() => setShowManualInput(true)}
        >
          <Ionicons name="keypad-outline" size={20} color="#7A9E9F" />
          <Text style={styles.manualButtonText}>Enter barcode manually</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#7A9E9F" />
            <Text style={styles.infoTitle}>What we check for:</Text>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.infoText}>Ingredients that match your skin goals</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.infoText}>Potential irritants & allergens</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.infoText}>Your specific sensitivities</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Manual Input Modal */}
      <Modal
        visible={showManualInput}
        animationType="fade"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Barcode</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowManualInput(false);
                  setManualBarcode('');
                }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter the UPC or EAN barcode number from the product packaging
            </Text>

            <TextInput
              style={styles.barcodeInput}
              placeholder="e.g., 3337875597197"
              placeholderTextColor="#9CA3AF"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
              maxLength={14}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (manualBarcode.length < 8 || isLoading) && styles.submitButtonDisabled,
              ]}
              onPress={handleManualSubmit}
              disabled={manualBarcode.length < 8 || isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Looking up...' : 'Look Up Product'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scanFrame: {
    width: 220,
    height: 160,
    position: 'relative',
    marginBottom: 28,
    marginTop: 20,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#7A9E9F',
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#7A9E9F',
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#7A9E9F',
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#7A9E9F',
    borderBottomRightRadius: 8,
  },
  scanInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanButton: {
    width: '100%',
    marginBottom: 12,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  manualButtonText: {
    fontSize: 14,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  infoCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoList: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  barcodeInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#7A9E9F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

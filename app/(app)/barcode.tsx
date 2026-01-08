import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Product Check</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.scanFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <View style={styles.scanInner}>
            <Ionicons name="barcode-outline" size={80} color="#1F2937" />
            <Text style={styles.scanText}>Position barcode here</Text>
          </View>
        </View>

        <Text style={styles.title}>Check Product Safety</Text>
        <Text style={styles.subtitle}>
          Scan any skincare product barcode to get{'\n'}a personalized compatibility score
        </Text>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanPress} activeOpacity={0.9}>
          <Ionicons name="camera" size={22} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity>

        {/* Search Options */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/(app)/search-product' as any)}
          >
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <Text style={styles.optionButtonText}>Search by name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowManualInput(true)}
          >
            <Ionicons name="keypad-outline" size={20} color="#6B7280" />
            <Text style={styles.optionButtonText}>Enter barcode</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="shield-checkmark" size={18} color="#1F2937" />
            </View>
            <Text style={styles.infoTitle}>What we check for</Text>
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
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
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
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1F2937',
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1F2937',
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#1F2937',
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1F2937',
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
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#111111',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(17, 24, 39, 0.2)',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

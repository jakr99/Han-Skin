import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skin Analysis</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.scanCircle}>
          <View style={styles.scanInnerCircle}>
            <Ionicons name="scan-outline" size={60} color="#1F2937" />
          </View>
        </View>

        <Text style={styles.title}>Ready to Scan</Text>
        <Text style={styles.subtitle}>
          Position your face within the frame{'\n'}for an accurate skin analysis
        </Text>

        <TouchableOpacity style={styles.scanButton} activeOpacity={0.9}>
          <Text style={styles.scanButtonText}>Start Scan</Text>
        </TouchableOpacity>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for best results</Text>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="sunny-outline" size={18} color="#1F2937" />
            </View>
            <Text style={styles.tipText}>Good natural lighting</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="water-outline" size={18} color="#1F2937" />
            </View>
            <Text style={styles.tipText}>Clean, makeup-free skin</Text>
          </View>
          <View style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name="phone-portrait-outline" size={18} color="#1F2937" />
            </View>
            <Text style={styles.tipText}>Hold phone at arm's length</Text>
          </View>
        </View>
      </View>
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
    paddingTop: 40,
  },
  scanCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(17, 24, 39, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  scanInnerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 32,
  },
  scanButton: {
    width: '100%',
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
  },
});

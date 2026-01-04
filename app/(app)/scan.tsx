import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 18 || currentHour < 6;

  const backgroundColors = isNightTime
    ? ['#2D1B4E', '#1E1333', '#150D24', '#0D0815']
    : ['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0'];

  const accentColor = isNightTime ? '#B794F6' : '#7A9E9F';
  const textColor = isNightTime ? '#FFFFFF' : '#1F2937';
  const subtitleColor = isNightTime ? '#C4B5D4' : '#6B7280';
  const cardBg = isNightTime ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF';
  const cardBorder = isNightTime ? 'rgba(183, 148, 246, 0.3)' : '#E5E2DE';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={[styles.scanCircle, { borderColor: accentColor }]}>
          <View style={[styles.scanInnerCircle, { backgroundColor: isNightTime ? 'rgba(183, 148, 246, 0.15)' : 'rgba(122, 158, 159, 0.1)' }]}>
            <Ionicons name="scan-outline" size={60} color={accentColor} />
          </View>
        </View>

        <Text style={[styles.title, { color: textColor }]}>Skin Analysis</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Position your face within the frame{'\n'}for an accurate skin scan
        </Text>

        <TouchableOpacity style={styles.scanButton}>
          <LinearGradient
            colors={isNightTime ? ['#B794F6', '#9061E4'] : ['#A8C5C6', '#7A9E9F']}
            style={styles.scanButtonGradient}
          >
            <Text style={styles.scanButtonText}>Start Scan</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={[styles.tipsContainer, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.tipsTitle, { color: textColor }]}>Tips for best results:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="sunny-outline" size={16} color={accentColor} />
            <Text style={[styles.tipText, { color: subtitleColor }]}>Good natural lighting</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="water-outline" size={16} color={accentColor} />
            <Text style={[styles.tipText, { color: subtitleColor }]}>Clean, makeup-free skin</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="phone-portrait-outline" size={16} color={accentColor} />
            <Text style={[styles.tipText, { color: subtitleColor }]}>Hold phone at arm's length</Text>
          </View>
        </View>

        {isNightTime && (
          <View style={styles.nightModeIndicator}>
            <Ionicons name="moon" size={14} color="#B794F6" />
            <Text style={styles.nightModeText}>Night Mode</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  scanCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  scanInnerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  scanButton: {
    width: '100%',
    marginBottom: 40,
  },
  scanButtonGradient: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsContainer: {
    alignSelf: 'stretch',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
  },
  nightModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(183, 148, 246, 0.2)',
    borderRadius: 16,
  },
  nightModeText: {
    fontSize: 12,
    color: '#B794F6',
    fontWeight: '500',
  },
});

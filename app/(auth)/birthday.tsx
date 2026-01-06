import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2020 - i);

type PickerType = 'month' | 'day' | 'year' | null;

export default function BirthdayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  const handleContinue = () => {
    router.push('/(auth)/onboarding/goals');
  };

  const isComplete = month !== null && day !== null && year !== null;

  const calculateAge = () => {
    if (!year) return null;
    const today = new Date();
    let age = today.getFullYear() - year;
    if (month !== null && day !== null) {
      if (today < new Date(today.getFullYear(), month, day)) {
        age--;
      }
    }
    return age;
  };

  const age = calculateAge();

  const renderPickerModal = () => {
    let data: any[] = [];
    let title = '';
    let onSelect: (value: any) => void = () => {};

    if (activePicker === 'month') {
      data = MONTHS.map((m, i) => ({ label: m, value: i }));
      title = 'Month';
      onSelect = (item) => setMonth(item.value);
    } else if (activePicker === 'day') {
      data = DAYS.map(d => ({ label: d.toString(), value: d }));
      title = 'Day';
      onSelect = (item) => setDay(item.value);
    } else if (activePicker === 'year') {
      data = YEARS.map(y => ({ label: y.toString(), value: y }));
      title = 'Year';
      onSelect = (item) => setYear(item.value);
    }

    return (
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.handleBar} />
            <Text style={styles.modalTitle}>{title}</Text>

            <FlatList
              data={data}
              keyExtractor={(item) => item.value.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
              renderItem={({ item }) => {
                const isSelected =
                  (activePicker === 'month' && month === item.value) ||
                  (activePicker === 'day' && day === item.value) ||
                  (activePicker === 'year' && year === item.value);

                return (
                  <TouchableOpacity
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => {
                      onSelect(item);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#1F2937" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

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

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '18%' }]} />
          </View>
        </View>

        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>When's your birthday?</Text>
          <Text style={styles.subtitle}>This helps us personalize your routine</Text>

          {/* Date Selectors */}
          <View style={styles.selectorsRow}>
            {/* Month */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorMonth]}
              onPress={() => setActivePicker('month')}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectorText, month === null && styles.selectorPlaceholder]}>
                {month !== null ? MONTHS[month] : 'Month'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Day */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorDay]}
              onPress={() => setActivePicker('day')}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectorText, day === null && styles.selectorPlaceholder]}>
                {day !== null ? day : 'Day'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Year */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorYear]}
              onPress={() => setActivePicker('year')}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectorText, year === null && styles.selectorPlaceholder]}>
                {year !== null ? year : 'Year'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Age pill */}
          {isComplete && age !== null && (
            <View style={styles.agePill}>
              <Text style={styles.ageText}>{age} years old</Text>
            </View>
          )}

          {/* Privacy note */}
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
            <Text style={styles.privacyText}>Only visible to you</Text>
          </View>
        </View>

        {/* Continue button */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[styles.continueButton, !isComplete && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!isComplete}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderPickerModal()}
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
  progressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: isSmallDevice ? 40 : 60,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: isSmallDevice ? 15 : 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  selectorsRow: {
    flexDirection: 'row',
    marginTop: isSmallDevice ? 28 : 36,
    gap: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingHorizontal: 14,
    height: isSmallDevice ? 50 : 54,
  },
  selectorMonth: {
    flex: 2,
  },
  selectorDay: {
    flex: 1,
  },
  selectorYear: {
    flex: 1.2,
  },
  selectorText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectorPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  agePill: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    borderRadius: 20,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  privacyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  bottomSection: {
    paddingTop: 16,
  },
  continueButton: {
    height: isSmallDevice ? 52 : 56,
    backgroundColor: '#111111',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAFAF8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(17, 24, 39, 0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { useOnboarding } from '@/context/OnboardingContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const {
    birthdayMonth,
    birthdayDay,
    birthdayYear,
    setBirthdayMonth,
    setBirthdayDay,
    setBirthdayYear,
  } = useOnboarding();

  const [month, setMonth] = useState<number | null>(() => {
    if (!birthdayMonth) {
      return null;
    }
    const parsed = Number.parseInt(birthdayMonth, 10);
    return Number.isNaN(parsed) ? null : parsed - 1;
  });
  const [day, setDay] = useState<number | null>(() => {
    if (!birthdayDay) {
      return null;
    }
    const parsed = Number.parseInt(birthdayDay, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });
  const [year, setYear] = useState<number | null>(() => {
    if (!birthdayYear) {
      return null;
    }
    const parsed = Number.parseInt(birthdayYear, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });
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
      const birthDate = new Date(year, month, day);
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
      onSelect = (item) => {
        setMonth(item.value);
        setBirthdayMonth(String(item.value + 1).padStart(2, '0'));
      };
    } else if (activePicker === 'day') {
      data = DAYS.map(d => ({ label: d.toString(), value: d }));
      title = 'Day';
      onSelect = (item) => {
        setDay(item.value);
        setBirthdayDay(String(item.value).padStart(2, '0'));
      };
    } else if (activePicker === 'year') {
      data = YEARS.map(y => ({ label: y.toString(), value: y }));
      title = 'Year';
      onSelect = (item) => {
        setYear(item.value);
        setBirthdayYear(String(item.value));
      };
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
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Title */}
            <Text style={styles.modalTitle}>{title}</Text>

            {/* Options */}
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
                      <Ionicons name="checkmark" size={20} color="#7A9E9F" />
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
    <OnboardingContainer currentStep={2} totalSteps={11}>
      <View className="flex-1">
        <View className="items-center pt-8">
          <Logo size="md" />

          <Text style={styles.title}>
            When's your birthday?
          </Text>

          <Text style={styles.subtitle}>
            This helps us personalize your routine
          </Text>

          {/* Date Selectors */}
          <View style={styles.selectorsRow}>
            {/* Month */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorMonth]}
              onPress={() => setActivePicker('month')}
            >
              <Text style={[styles.selectorText, month === null && styles.selectorPlaceholder]}>
                {month !== null ? MONTHS[month] : 'Month'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Day */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorDay]}
              onPress={() => setActivePicker('day')}
            >
              <Text style={[styles.selectorText, day === null && styles.selectorPlaceholder]}>
                {day !== null ? day : 'Day'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Year */}
            <TouchableOpacity
              style={[styles.selector, styles.selectorYear]}
              onPress={() => setActivePicker('year')}
            >
              <Text style={[styles.selectorText, year === null && styles.selectorPlaceholder]}>
                {year !== null ? year : 'Year'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
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
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!isComplete}
          />
        </View>
      </View>

      {renderPickerModal()}
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  selectorsRow: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E2DE',
    paddingHorizontal: 14,
    height: 52,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(122, 158, 159, 0.12)',
    borderRadius: 20,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7A9E9F',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  privacyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
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
    backgroundColor: '#E5E2DE',
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
    backgroundColor: 'rgba(122, 158, 159, 0.12)',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#7A9E9F',
  },
});

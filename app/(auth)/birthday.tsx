import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/domain/Logo';
import { Button } from '@/components/ui/Button';

export default function BirthdayScreen() {
  const router = useRouter();
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const handleContinue = () => {
    // TODO: Store birthday in context/state
    router.push('/(auth)/onboarding/goals');
  };

  const isValid = month.length === 2 && day.length === 2 && year.length === 4;

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setMonth(cleaned);
  };

  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    setDay(cleaned);
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(cleaned);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#3D3D3D" />
        </TouchableOpacity>

        <View className="flex-1 px-6 justify-between">
          {/* Top Section */}
          <View className="items-center pt-8">
            {/* Logo */}
            <Logo size="md" />

            {/* Question */}
            <Text className="text-2xl font-semibold text-text-primary text-center mt-8">
              Your birthday?
            </Text>

            {/* Date Input */}
            <View className="w-full mt-8">
              <View style={styles.dateContainer}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM"
                  placeholderTextColor="#A0A0A0"
                  value={month}
                  onChangeText={handleMonthChange}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD"
                  placeholderTextColor="#A0A0A0"
                  value={day}
                  onChangeText={handleDayChange}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  style={[styles.dateInput, styles.yearInput]}
                  placeholder="YYYY"
                  placeholderTextColor="#A0A0A0"
                  value={year}
                  onChangeText={handleYearChange}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>

              {/* Privacy Note */}
              <View className="flex-row items-center justify-end mt-2">
                <Text className="text-text-secondary text-sm mr-1">
                  Only you
                </Text>
                <Ionicons name="lock-closed" size={14} color="#7A7A7A" />
              </View>
            </View>

            {/* Continue Button */}
            <View className="w-full mt-6">
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isValid}
              />
            </View>
          </View>

          {/* Bottom Logo */}
          <View className="items-center pb-8">
            <Logo size="sm" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E2DE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  dateInput: {
    fontSize: 16,
    color: '#3D3D3D',
    textAlign: 'center',
    width: 40,
  },
  yearInput: {
    width: 60,
  },
  dateSeparator: {
    fontSize: 16,
    color: '#A0A0A0',
    marginHorizontal: 4,
  },
});

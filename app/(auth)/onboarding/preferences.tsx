import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { ToggleRow } from '@/components/ui/ToggleRow';
import { TextureSelector } from '@/components/ui/TextureSelector';
import { BudgetSlider } from '@/components/ui/BudgetSlider';
import { Button } from '@/components/ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const VALUES = [
  { id: 'vegan', icon: '🌱', title: 'Vegan', description: 'Plant-based ingredients only' },
  { id: 'cruelty_free', icon: '🐰', title: 'Cruelty-free', description: 'Not tested on animals' },
  { id: 'fragrance_free', icon: '🚫', title: 'Fragrance-free', description: 'No added fragrances' },
];

const TEXTURES = [
  { id: 'serum', label: 'Serum', icon: '💧' },
  { id: 'gel', label: 'Gel', icon: '🧊' },
  { id: 'cream', label: 'Cream', icon: '🧴' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const {
    values,
    setValues,
    texture,
    setTexture,
    budgetFriendly,
    setBudgetFriendly,
    budgetLevel,
    setBudgetLevel,
    otherNotes,
    setOtherNotes,
  } = useOnboarding();

  const updateValue = (id: string, value: boolean) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <OnboardingContainer currentStep={9} totalSteps={11}>
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>How do you like your skincare?</Text>
          <Text style={styles.subtitle}>
            Let us know your preferences so we can better{'\n'}recommend products for you.
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Values Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Values</Text>
            {VALUES.map((item) => (
              <ToggleRow
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={values[item.id]}
                onValueChange={(value) => updateValue(item.id, value)}
              />
            ))}
          </View>

          {/* Texture Preference */}
          <View style={styles.section}>
            <View style={styles.textureHeader}>
              <Text style={styles.sectionTitle}>Texture preference</Text>
              <Text style={styles.textureSubtitle}>Lightweight (Gel / serum)</Text>
            </View>
            <TextureSelector
              options={TEXTURES}
              selectedId={texture}
              onSelect={setTexture}
            />
          </View>

          {/* Budget Friendly */}
          <View style={styles.section}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetLabelContainer}>
                <Text style={styles.budgetIcon}>💰</Text>
                <Text style={styles.sectionTitle}>Budget friendly</Text>
              </View>
              <Switch
                value={budgetFriendly}
                onValueChange={setBudgetFriendly}
                trackColor={{ false: '#E5E2DE', true: '#A8C5C6' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E2DE"
              />
            </View>
            {budgetFriendly && (
              <BudgetSlider
                value={budgetLevel}
                onValueChange={setBudgetLevel}
              />
            )}
          </View>

          {/* Other Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anything else we should know?</Text>
            <TextInput
              style={styles.otherInput}
              placeholder="Optional notes..."
              placeholderTextColor="#A0A0A0"
              value={otherNotes}
              onChangeText={setOtherNotes}
              multiline
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
            onPress={handleContinue}
          />
          <Text style={styles.helperText}>
            You can always change this later.
          </Text>
        </View>
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3D3D3D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D3D3D',
    marginBottom: 12,
  },
  textureHeader: {
    marginBottom: 12,
  },
  textureSubtitle: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EDEA',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  budgetLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#3D3D3D',
    minHeight: 50,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  helperText: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 12,
  },
});

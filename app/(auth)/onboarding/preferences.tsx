import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { OnboardingContainer } from '@/components/layout/OnboardingContainer';
import { Button } from '@/components/ui/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;

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
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<Record<string, boolean>>({
    vegan: false,
    cruelty_free: false,
    fragrance_free: false,
  });
  const [texture, setTexture] = useState('serum');
  const [budgetFriendly, setBudgetFriendly] = useState(false);
  const [budgetLevel, setBudgetLevel] = useState(50);
  const [otherNotes, setOtherNotes] = useState('');

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
              <View key={item.id} style={styles.toggleCard}>
                <View style={styles.toggleIconContainer}>
                  <Text style={styles.toggleIcon}>{item.icon}</Text>
                </View>
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>{item.title}</Text>
                  <Text style={styles.toggleDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={values[item.id]}
                  onValueChange={(value) => updateValue(item.id, value)}
                  trackColor={{ false: 'rgba(17, 24, 39, 0.08)', true: '#1F2937' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="rgba(17, 24, 39, 0.08)"
                />
              </View>
            ))}
          </View>

          {/* Texture Preference */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Texture preference</Text>
            <View style={styles.textureRow}>
              {TEXTURES.map((tex) => {
                const isSelected = texture === tex.id;
                return (
                  <TouchableOpacity
                    key={tex.id}
                    style={[styles.textureCard, isSelected && styles.textureCardSelected]}
                    onPress={() => setTexture(tex.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.textureIcon}>{tex.icon}</Text>
                    <Text style={[styles.textureLabel, isSelected && styles.textureLabelSelected]}>
                      {tex.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
                trackColor={{ false: 'rgba(17, 24, 39, 0.08)', true: '#1F2937' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="rgba(17, 24, 39, 0.08)"
              />
            </View>
            {budgetFriendly && (
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={budgetLevel}
                  onValueChange={setBudgetLevel}
                  minimumTrackTintColor="#1F2937"
                  maximumTrackTintColor="rgba(17, 24, 39, 0.08)"
                  thumbTintColor="#1F2937"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Budget</Text>
                  <Text style={styles.sliderLabel}>Premium</Text>
                </View>
              </View>
            )}
          </View>

          {/* Other Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anything else we should know?</Text>
            <TextInput
              style={styles.otherInput}
              placeholder="Optional notes..."
              placeholderTextColor="#9CA3AF"
              value={otherNotes}
              onChangeText={setOtherNotes}
              multiline
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
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
    paddingTop: isSmallDevice ? 8 : 16,
    marginBottom: isSmallDevice ? 12 : 20,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  section: {
    marginBottom: isSmallDevice ? 18 : 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  toggleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleIcon: {
    fontSize: 20,
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  textureRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  textureCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.02)',
  },
  textureIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  textureLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  textureLabelSelected: {
    fontWeight: '600',
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  budgetLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sliderContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 12,
  },
});

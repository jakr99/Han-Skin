// =============================================================================
// Onboarding Context - Han Skin
// Collects all onboarding data and saves to Supabase at completion
// =============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface OnboardingData {
  // Name (existing)
  firstName: string;
  lastName: string;

  // Goals screen (step 3)
  goals: string[];

  // Concerns screen (step 4)
  concerns: string[];

  // Skin type screen (step 5)
  skinType: string | null;

  // Lifestyle screen (step 7)
  lifestyle: {
    outdoor: string;
    exercise: string;
    climate: string;
    makeup: string;
    pollution: string;
  };

  // Sensitivities screen (step 8)
  sensitivities: string[];
  otherSensitivities: string;
}

type OnboardingContextValue = {
  // Existing
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;

  // New skin profile data
  data: OnboardingData;
  setGoals: (goals: string[]) => void;
  setConcerns: (concerns: string[]) => void;
  setSkinType: (skinType: string) => void;
  setLifestyle: (lifestyle: OnboardingData['lifestyle']) => void;
  setSensitivities: (sensitivities: string[], other: string) => void;
  saveToSupabase: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;

  reset: () => void;
};

// -----------------------------------------------------------------------------
// Default Data
// -----------------------------------------------------------------------------
const DEFAULT_LIFESTYLE = {
  outdoor: 'rarely',
  exercise: 'no',
  climate: 'dry',
  makeup: 'daily',
  pollution: 'low',
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  // Existing name fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // New skin profile fields
  const [goals, setGoalsState] = useState<string[]>([]);
  const [concerns, setConcernsState] = useState<string[]>([]);
  const [skinType, setSkinTypeState] = useState<string | null>(null);
  const [lifestyle, setLifestyleState] = useState(DEFAULT_LIFESTYLE);
  const [sensitivities, setSensitivitiesState] = useState<string[]>([]);
  const [otherSensitivities, setOtherSensitivities] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reset = useCallback(() => {
    setFirstName('');
    setLastName('');
    setGoalsState([]);
    setConcernsState([]);
    setSkinTypeState(null);
    setLifestyleState(DEFAULT_LIFESTYLE);
    setSensitivitiesState([]);
    setOtherSensitivities('');
  }, []);

  const setGoals = useCallback((newGoals: string[]) => {
    setGoalsState(newGoals);
  }, []);

  const setConcerns = useCallback((newConcerns: string[]) => {
    setConcernsState(newConcerns);
  }, []);

  const setSkinType = useCallback((newSkinType: string) => {
    setSkinTypeState(newSkinType);
  }, []);

  const setLifestyle = useCallback((newLifestyle: OnboardingData['lifestyle']) => {
    setLifestyleState(newLifestyle);
  }, []);

  const setSensitivities = useCallback((newSensitivities: string[], other: string) => {
    setSensitivitiesState(newSensitivities);
    setOtherSensitivities(other);
  }, []);

  const saveToSupabase = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Get current user
      const { data: authData, error: userError } = await supabase.auth.getUser();

      if (userError || !authData.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const userId = authData.user.id;

      // 1. Update profiles table with skin type, climate, and preferences
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          skin_type: skinType,
          climate: lifestyle.climate,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        return { success: false, error: profileError.message };
      }

      // 2. Save concerns to user_concerns table
      if (concerns.length > 0) {
        // Clear existing concerns first
        await supabase
          .from('user_concerns')
          .delete()
          .eq('user_id', userId);

        const concernsToInsert = concerns.map((concern, index) => ({
          user_id: userId,
          concern_type: concern,
          severity: 3, // Default severity
          priority: index + 1,
        }));

        const { error: concernsError } = await supabase
          .from('user_concerns')
          .insert(concernsToInsert);

        if (concernsError) {
          console.error('Concerns insert error:', concernsError);
          return { success: false, error: concernsError.message };
        }
      }

      // 3. Save goals as concerns with a "goal_" prefix to distinguish them
      if (goals.length > 0) {
        const goalsToInsert = goals.map((goal, index) => ({
          user_id: userId,
          concern_type: `goal_${goal}`,
          severity: 4, // Higher severity for goals
          priority: index + 1,
        }));

        const { error: goalsError } = await supabase
          .from('user_concerns')
          .insert(goalsToInsert);

        if (goalsError) {
          console.error('Goals insert error:', goalsError);
          // Don't fail the whole operation for goals
        }
      }

      // 4. Save sensitivities to user_sensitivities table
      const allSensitivities = [...sensitivities];

      // Add "other" as a sensitivity if specified
      if (otherSensitivities.trim()) {
        allSensitivities.push('other');
      }

      if (allSensitivities.length > 0) {
        // Clear existing sensitivities first
        await supabase
          .from('user_sensitivities')
          .delete()
          .eq('user_id', userId);

        const sensitivitiesToInsert = allSensitivities.map((sensitivity) => ({
          user_id: userId,
          sensitivity_type: sensitivity,
          confirmed: true,
          severity: 3,
          reaction_type: sensitivity === 'other' ? otherSensitivities : null,
        }));

        const { error: sensitivitiesError } = await supabase
          .from('user_sensitivities')
          .insert(sensitivitiesToInsert);

        if (sensitivitiesError) {
          console.error('Sensitivities insert error:', sensitivitiesError);
          return { success: false, error: sensitivitiesError.message };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Save to Supabase error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, [skinType, lifestyle.climate, concerns, goals, sensitivities, otherSensitivities]);

  const data: OnboardingData = useMemo(
    () => ({
      firstName,
      lastName,
      goals,
      concerns,
      skinType,
      lifestyle,
      sensitivities,
      otherSensitivities,
    }),
    [firstName, lastName, goals, concerns, skinType, lifestyle, sensitivities, otherSensitivities]
  );

  const value = useMemo(
    () => ({
      firstName,
      lastName,
      setFirstName,
      setLastName,
      data,
      setGoals,
      setConcerns,
      setSkinType,
      setLifestyle,
      setSensitivities,
      saveToSupabase,
      isLoading,
      reset,
    }),
    [
      firstName,
      lastName,
      data,
      setGoals,
      setConcerns,
      setSkinType,
      setLifestyle,
      setSensitivities,
      saveToSupabase,
      isLoading,
      reset,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider.');
  }

  return context;
}

// =============================================================================
// User Profile Context - Han Skin
// Provides user skin profile data for scoring calculations
// =============================================================================

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { UserSkinProfile, SkinType } from '@/types/scanner';

// -----------------------------------------------------------------------------
// Default Profile (used before user completes onboarding)
// -----------------------------------------------------------------------------
const DEFAULT_PROFILE: UserSkinProfile = {
  skinType: 'normal',
  concerns: [],
  sensitivities: [],
};

// -----------------------------------------------------------------------------
// Context Type
// -----------------------------------------------------------------------------
interface UserProfileContextValue {
  profile: UserSkinProfile;
  updateProfile: (updates: Partial<UserSkinProfile>) => void;
  setSkinType: (skinType: SkinType) => void;
  setConcerns: (concerns: string[]) => void;
  setSensitivities: (sensitivities: string[]) => void;
  hasCompletedProfile: boolean;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------
export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserSkinProfile>(DEFAULT_PROFILE);

  const updateProfile = (updates: Partial<UserSkinProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const setSkinType = (skinType: SkinType) => {
    setProfile((prev) => ({ ...prev, skinType }));
  };

  const setConcerns = (concerns: string[]) => {
    setProfile((prev) => ({ ...prev, concerns }));
  };

  const setSensitivities = (sensitivities: string[]) => {
    setProfile((prev) => ({ ...prev, sensitivities }));
  };

  const hasCompletedProfile = useMemo(() => {
    return profile.concerns.length > 0 || profile.sensitivities.length > 0;
  }, [profile]);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      setSkinType,
      setConcerns,
      setSensitivities,
      hasCompletedProfile,
    }),
    [profile, hasCompletedProfile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider.');
  }
  return context;
}

// -----------------------------------------------------------------------------
// Mock Profile for Testing
// -----------------------------------------------------------------------------
export const MOCK_USER_PROFILE: UserSkinProfile = {
  skinType: 'oily',
  concerns: ['acne', 'dark spots', 'large pores'],
  sensitivities: ['fragrance', 'essential oils'],
};

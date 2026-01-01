import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type OnboardingContextValue = {
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const reset = useCallback(() => {
    setFirstName('');
    setLastName('');
  }, []);

  const value = useMemo(
    () => ({
      firstName,
      lastName,
      setFirstName,
      setLastName,
      reset,
    }),
    [firstName, lastName, reset]
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

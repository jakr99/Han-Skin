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
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  birthdayMonth: string;
  birthdayDay: string;
  birthdayYear: string;
  setBirthdayMonth: React.Dispatch<React.SetStateAction<string>>;
  setBirthdayDay: React.Dispatch<React.SetStateAction<string>>;
  setBirthdayYear: React.Dispatch<React.SetStateAction<string>>;
  goals: string[];
  setGoals: React.Dispatch<React.SetStateAction<string[]>>;
  concerns: string[];
  setConcerns: React.Dispatch<React.SetStateAction<string[]>>;
  skinType: string | null;
  setSkinType: React.Dispatch<React.SetStateAction<string | null>>;
  routineLevel: string | null;
  setRoutineLevel: React.Dispatch<React.SetStateAction<string | null>>;
  productTypes: string[];
  setProductTypes: React.Dispatch<React.SetStateAction<string[]>>;
  lifestyle: Record<string, string>;
  setLifestyle: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  sensitivities: Record<string, boolean>;
  setSensitivities: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  sensitivitiesOther: string;
  setSensitivitiesOther: React.Dispatch<React.SetStateAction<string>>;
  values: Record<string, boolean>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  texture: string;
  setTexture: React.Dispatch<React.SetStateAction<string>>;
  budgetFriendly: boolean;
  setBudgetFriendly: React.Dispatch<React.SetStateAction<boolean>>;
  budgetLevel: number;
  setBudgetLevel: React.Dispatch<React.SetStateAction<number>>;
  otherNotes: string;
  setOtherNotes: React.Dispatch<React.SetStateAction<string>>;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdayMonth, setBirthdayMonth] = useState('');
  const [birthdayDay, setBirthdayDay] = useState('');
  const [birthdayYear, setBirthdayYear] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [routineLevel, setRoutineLevel] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<Record<string, string>>({
    outdoor: 'rarely',
    exercise: 'no',
    climate: 'dry',
    makeup: 'daily',
    pollution: 'low',
  });
  const [sensitivities, setSensitivities] = useState<Record<string, boolean>>({
    fragrance: false,
    acids: false,
    retinol: false,
    essential_oils: false,
  });
  const [sensitivitiesOther, setSensitivitiesOther] = useState('');
  const [values, setValues] = useState<Record<string, boolean>>({
    vegan: false,
    cruelty_free: false,
    fragrance_free: false,
  });
  const [texture, setTexture] = useState('serum');
  const [budgetFriendly, setBudgetFriendly] = useState(false);
  const [budgetLevel, setBudgetLevel] = useState(1);
  const [otherNotes, setOtherNotes] = useState('');

  const reset = useCallback(() => {
    setFirstName('');
    setLastName('');
    setBirthdayMonth('');
    setBirthdayDay('');
    setBirthdayYear('');
    setGoals([]);
    setConcerns([]);
    setSkinType(null);
    setRoutineLevel(null);
    setProductTypes([]);
    setLifestyle({
      outdoor: 'rarely',
      exercise: 'no',
      climate: 'dry',
      makeup: 'daily',
      pollution: 'low',
    });
    setSensitivities({
      fragrance: false,
      acids: false,
      retinol: false,
      essential_oils: false,
    });
    setSensitivitiesOther('');
    setValues({
      vegan: false,
      cruelty_free: false,
      fragrance_free: false,
    });
    setTexture('serum');
    setBudgetFriendly(false);
    setBudgetLevel(1);
    setOtherNotes('');
  }, []);

  const value = useMemo(
    () => ({
      firstName,
      lastName,
      setFirstName,
      setLastName,
      birthdayMonth,
      birthdayDay,
      birthdayYear,
      setBirthdayMonth,
      setBirthdayDay,
      setBirthdayYear,
      goals,
      setGoals,
      concerns,
      setConcerns,
      skinType,
      setSkinType,
      routineLevel,
      setRoutineLevel,
      productTypes,
      setProductTypes,
      lifestyle,
      setLifestyle,
      sensitivities,
      setSensitivities,
      sensitivitiesOther,
      setSensitivitiesOther,
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
      reset,
    }),
    [
      firstName,
      lastName,
      birthdayMonth,
      birthdayDay,
      birthdayYear,
      goals,
      concerns,
      skinType,
      routineLevel,
      productTypes,
      lifestyle,
      sensitivities,
      sensitivitiesOther,
      values,
      texture,
      budgetFriendly,
      budgetLevel,
      otherNotes,
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

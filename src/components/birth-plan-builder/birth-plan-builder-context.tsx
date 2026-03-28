"use client";

import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialBirthPreferences,
  initialMedicalPreferences,
  initialBirthPlanUserInfo,
  type BirthPreferences,
  type BirthPlanBuilderState,
  type BirthPlanUserInfo,
  type MedicalPreferences,
} from "./types";

type BirthPlanBuilderContextValue = {
  state: BirthPlanBuilderState;
  saveUserInfo: (userInfo: BirthPlanUserInfo) => void;
  saveBirthPreferences: (birthPreferences: BirthPreferences) => void;
  saveMedicalPreferences: (medicalPreferences: MedicalPreferences) => void;
  setCurrentStep: (step: number) => void;
  resetBuilder: () => void;
};

const BirthPlanBuilderContext = createContext<
  BirthPlanBuilderContextValue | undefined
>(undefined);

const initialBuilderState: BirthPlanBuilderState = {
  currentStep: 1,
  totalSteps: 4,
  userInfo: initialBirthPlanUserInfo,
  birthPreferences: initialBirthPreferences,
  medicalPreferences: initialMedicalPreferences,
};

export function BirthPlanBuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<BirthPlanBuilderState>({
    ...initialBuilderState,
  });

  const saveUserInfo = useCallback((userInfo: BirthPlanUserInfo) => {
    setState((previous) => ({
      ...previous,
      userInfo,
    }));
  }, []);

  const saveBirthPreferences = useCallback(
    (birthPreferences: BirthPreferences) => {
      setState((previous) => ({
        ...previous,
        birthPreferences,
      }));
    },
    []
  );

  const saveMedicalPreferences = useCallback(
    (medicalPreferences: MedicalPreferences) => {
      setState((previous) => ({
        ...previous,
        medicalPreferences,
      }));
    },
    []
  );

  const setCurrentStep = useCallback((step: number) => {
    setState((previous) => ({
      ...previous,
      currentStep: step,
    }));
  }, []);

  const resetBuilder = useCallback(() => {
    setState(initialBuilderState);
  }, []);

  const value = useMemo<BirthPlanBuilderContextValue>(
    () => ({
      state,
      saveUserInfo,
      saveBirthPreferences,
      saveMedicalPreferences,
      setCurrentStep,
      resetBuilder,
    }),
    [
      resetBuilder,
      saveBirthPreferences,
      saveMedicalPreferences,
      saveUserInfo,
      setCurrentStep,
      state,
    ]
  );

  return (
    <BirthPlanBuilderContext.Provider value={value}>
      {children}
    </BirthPlanBuilderContext.Provider>
  );
}

export function useBirthPlanBuilder() {
  const context = useContext(BirthPlanBuilderContext);

  if (!context) {
    throw new Error(
      "useBirthPlanBuilder must be used inside BirthPlanBuilderProvider."
    );
  }

  return context;
}

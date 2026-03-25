"use client";

import {
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
};

const BirthPlanBuilderContext = createContext<
  BirthPlanBuilderContextValue | undefined
>(undefined);

export function BirthPlanBuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<BirthPlanBuilderState>({
    currentStep: 1,
    totalSteps: 5,
    userInfo: initialBirthPlanUserInfo,
    birthPreferences: initialBirthPreferences,
    medicalPreferences: initialMedicalPreferences,
    futureAnswers: {},
  });

  const value = useMemo<BirthPlanBuilderContextValue>(
    () => ({
      state,
      saveUserInfo: (userInfo) =>
        setState((previous) => ({
          ...previous,
          userInfo,
        })),
      saveBirthPreferences: (birthPreferences) =>
        setState((previous) => ({
          ...previous,
          birthPreferences,
        })),
      saveMedicalPreferences: (medicalPreferences) =>
        setState((previous) => ({
          ...previous,
          medicalPreferences,
        })),
      setCurrentStep: (step) =>
        setState((previous) => ({
          ...previous,
          currentStep: step,
        })),
    }),
    [state]
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

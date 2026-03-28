export type PlannedBirthLocation =
  | ""
  | "Hospital"
  | "Birth Center"
  | "Home"
  | "Not Sure";

export type BirthEnvironmentPreference =
  | "Quiet room"
  | "Dim lighting"
  | "Music or calming sounds"
  | "Freedom to move"
  | "Minimal interruptions";

export type ComfortMeasure =
  | "Breathing guidance"
  | "Position changes"
  | "Massage or counterpressure"
  | "Shower or tub"
  | "Birth ball or peanut ball";

export type PainManagementPreference =
  | "I prefer to avoid pain medication if possible"
  | "I am open to an epidural"
  | "I want to learn about all available pain relief options"
  | "I would like to use natural comfort techniques first"
  | "I am unsure and want to decide in the moment";

export type InductionPreference =
  | ""
  | "I prefer to avoid induction unless medically necessary"
  | "I am open to induction if recommended"
  | "I want to discuss the pros and cons with my provider"
  | "I am unsure";

export type LaborAugmentationPreference =
  | ""
  | "I prefer to try position changes, rest, hydration, or movement first"
  | "I am open to medical options if needed"
  | "I want to understand each option before making a decision"
  | "I am unsure";

export type AssistedDeliveryPreference =
  | ""
  | "I want the care team to explain why it is recommended before moving forward"
  | "I am open to it if medically appropriate"
  | "I prefer to avoid it unless urgent"
  | "I am unsure";

export type CesareanPreference =
  | "Clear communication throughout the procedure"
  | "My support person present if possible"
  | "Skin-to-skin in the operating or recovery room if possible"
  | "Delayed newborn procedures when appropriate"
  | "I am not sure yet";

export type DecisionMakingPreference =
  | ""
  | "Please explain options and give me time to decide if possible"
  | "Please include my partner/support person in discussions"
  | "I prefer straightforward recommendations from the care team"
  | "A mix of explanation and guidance feels best"
  | "I am unsure";

export type BirthPlanUserInfo = {
  fullName: string;
  email: string;
  dueDate: string;
  careProvider: string;
  plannedBirthLocation: PlannedBirthLocation;
  supportPersonName: string;
};

export type BirthPreferences = {
  environmentPreferences: BirthEnvironmentPreference[];
  supportPeople: string;
  supportNotes: string;
  comfortMeasures: ComfortMeasure[];
};

export type MedicalPreferences = {
  painManagementPreferences: PainManagementPreference[];
  inductionPreference: InductionPreference;
  laborAugmentationPreference: LaborAugmentationPreference;
  assistedDeliveryPreference: AssistedDeliveryPreference;
  cesareanPreferences: CesareanPreference[];
  cesareanNotes: string;
  decisionMakingPreference: DecisionMakingPreference;
  additionalNotes: string;
};

export type BirthPlanBuilderState = {
  currentStep: number;
  totalSteps: number;
  userInfo: BirthPlanUserInfo;
  birthPreferences: BirthPreferences;
  medicalPreferences: MedicalPreferences;
};

export const initialBirthPlanUserInfo: BirthPlanUserInfo = {
  fullName: "",
  email: "",
  dueDate: "",
  careProvider: "",
  plannedBirthLocation: "",
  supportPersonName: "",
};

export const initialBirthPreferences: BirthPreferences = {
  environmentPreferences: [],
  supportPeople: "",
  supportNotes: "",
  comfortMeasures: [],
};

export const initialMedicalPreferences: MedicalPreferences = {
  painManagementPreferences: [],
  inductionPreference: "",
  laborAugmentationPreference: "",
  assistedDeliveryPreference: "",
  cesareanPreferences: [],
  cesareanNotes: "",
  decisionMakingPreference: "",
  additionalNotes: "",
};

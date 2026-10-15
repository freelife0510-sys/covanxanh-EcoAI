/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'home' | 'chat' | 'calculator' | 'waste' | 'assessment';

// Chat Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isMock?: boolean;
}

// Carbon Calculator Types
export type TransportType = 'bicycle' | 'electric_bike' | 'motorbike' | 'bus';

export interface CarbonInputs {
  transportType: TransportType;
  transportKmPerDay: number; // Daily roundtrip km
  schoolDaysPerMonth: number; // Default 26 days
  acHoursPerDay: number; // Hours AC per day
  acSharingPeople: number; // Number of people sharing the AC room (1 - 4 people)
  deviceChargingHoursPerDay: number; // Hours charging phones, laptops
  singleUsePlasticsPerWeek: number; // Bubble tea cups, PET bottles
  redMeatMealsPerWeek: number; // Meals with beef, pork, lamb per week
}

export interface CarbonBreakdown {
  transportCO2: number; // kg CO2 / month
  energyCO2: number; // kg CO2 / month
  consumptionCO2: number; // kg CO2 / month
  nutritionCO2: number; // kg CO2 / month
  totalCO2: number; // kg CO2 / month
  treesNeeded: number; // Approximate trees needed to absorb in a year (approx 21-22 kg CO2 / tree / year)
  ratingLevel: 'green' | 'moderate' | 'alarm'; // <35, 35-55, >55
}

export interface GreenActionChallenge {
  id: string;
  day: number;
  title: string;
  description: string;
  schoolContext: string;
  impactScore: number;
  completed: boolean;
}

export interface CarbonDiagnosisResult {
  ratingLevel: 'green' | 'moderate' | 'alarm';
  ratingTitle: string;
  summaryAssessment: string;
  biggestBottleneck: {
    source: string;
    description: string;
    percentage: number;
  };
  sevenDayChallenge: GreenActionChallenge[];
  ecoQuote: string;
  isMock?: boolean;
}

// Waste Classification Types (Luật Bảo vệ Môi trường 2020)
export type WasteCategory =
  | 'Rác tái chế'
  | 'Rác thực phẩm'
  | 'Rác nguy hại'
  | 'Rác sinh hoạt khác';

export interface WasteAnalysisResult {
  item_name: string;
  waste_type: WasteCategory;
  decomposition_time: string;
  instruction: string;
  eco_impact: string;
  alternative: string;
  timestamp?: string;
  imageUrl?: string;
  isDemo?: boolean;
  isFallbackWarning?: boolean;
}

export interface PresetSample {
  id: string;
  name: string;
  category: WasteCategory;
  thumbnailUrl: string;
  description: string;
  analysis: WasteAnalysisResult;
}

// Educational Assessment & Study Sheet (GDPT 2018)
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectDomain: 'Địa lí' | 'Sinh học' | 'HĐTN' | 'Môi trường' | 'Khí hậu' | string;
}

export interface StudentStudyRecord {
  studentName: string;
  schoolClass: string;
  date: string;
  carbonTotal: number;
  carbonRating: string;
  completedChallengesCount: number;
  preTestScore: number | null;
  postTestScore: number | null;
  reflectionAnswer: string;
}

// App Settings & Config
export interface AppSettings {
  apiKey: string;
  hasCustomKey: boolean;
  serverKeyAvailable: boolean;
  soundEnabled: boolean;
}

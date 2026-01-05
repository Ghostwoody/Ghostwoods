
export interface IntakeData {
  style: string;
  dynamics: 'Light' | 'Medium' | 'Aggressive';
  toneGoals: string[];
  guitarType: string;
  bodyWood: string;
  scaleLength: string;
  currentIssues: string;
  currentRouting: string;
  // Rig Context Fields
  pedalType: string;
  ampType: string;
  guitarBrand: string;
  guitarModel: string;
  // Performance Context
  performanceType: string;
  // Rhodes Specific
  pianoYear?: string;
  rhodesFailureInfo?: string;
  packSize?: string;
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface PersonaStrings {
  heroTitle: string;
  heroSubtitle: string;
  loadingMessage: string;
  summaryTitle: string;
  manifestTitle: string;
  manifestSubtitle: string;
}

export interface BrandHeritage {
  summary: string;
  links: GroundingLink[];
  demos?: GroundingLink[];
  persona?: PersonaStrings;
}

export interface PickupSpec {
  type: string;
  magnetType: string;
  wireGauge: string;
  windApproach: string;
  dcResistance: string;
  potting: 'None' | 'Light' | 'Heavy';
  frequencyResponse: { freq: string; value: number }[];
  luthierNote: string;
  realityCheck: string;
  windStyle: 'Underwound' | 'Standard' | 'Overwound' | 'Hot';
  windCount: string;
  magnetPolarity: 'North Up' | 'South Up' | 'RWRP';
}

export interface FinalDesign {
  id: string;
  timestamp: number;
  intake: IntakeData;
  pickup: PickupSpec;
}

export interface ComparisonAnalysis {
  tonalDifference: string;
  playingExperience: string;
  recommendation: string;
}

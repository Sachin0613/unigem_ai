
export enum UrgencyLevel {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  ROUTINE = 'ROUTINE',
  HOME_CARE = 'HOME_CARE'
}

export interface TriageResponse {
  urgency: UrgencyLevel;
  summary: string;
  dangerSigns: string[];
  actionItems: string[];
  questionsForClinician: string[];
  reasoning: string;
}

export interface ChronicMetric {
  date: string;
  value: number;
  unit: string;
  note?: string;
}

export interface ChronicCareResponse {
  patientStatusSummary: string;
  metrics: ChronicMetric[];
  dailyTasks: string[];
  lifestylePointers: string[];
}

// New Health Feature: Meds
export interface MedsResponse {
  identifiedItems: string[];
  simplifiedInstructions: string;
  warnings: string[];
  sideEffects: string[];
}

export interface EducationResponse {
  explanation?: string;
  quizQuestions?: string[];
  relatedTopics?: string[];
  studyPlan?: { day: string; tasks: string[]; focus: string }[];
  // New Education Feature: Grading
  grading?: {
    grade: string;
    corrections: Array<{ original: string; correction: string; reason: string }>;
    feedback: string;
  };
}

export interface AccessibilityResponse {
  description: string;
  simplifiedText?: string;
  suggestedAction?: string;
  directAnswer?: string;
  // New Access Feature: Navigation
  navigation?: {
    hazards: string[];
    pathSuggestion: string;
    clockDirections: string; // e.g., "Door at 12 o'clock"
  };
}

export interface ScienceResponse {
  summary?: string;
  hypotheses?: string[];
  keyLiteraturePoints?: string[];
  methodologyCritique?: string;
  extractedData?: { title: string; markdownTable: string; insights: string[] };
  // New Science Feature: Simulation
  simulation?: {
    prediction: string;
    safetyRisks: string[];
    stepByStepOutcome: string[];
  };
}

export interface BusinessResponse {
  workflowAnalysis?: string;
  bottlenecks?: string[];
  automationSuggestions?: string[];
  meetingSummary?: {
    participants: string[];
    decisions: string[];
    actionItems: { owner: string; task: string; deadline: string }[];
  };
  // New Business Feature: Contract
  contractAnalysis?: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    redFlags: string[];
    missingClauses: string[];
    summary: string;
  };
}

export interface TechResponse {
  codeAnalysis?: string;
  refactoredCode?: string;
  testCases?: string[];
  bugAnalysis?: { rootCause: string; fixExplanation: string; fixedSnippet: string };
  // New Tech Feature: Security
  securityAudit?: {
    vulnerabilities: Array<{ type: string; severity: string; line: number; description: string }>;
    patchedCode: string;
    securityScore: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

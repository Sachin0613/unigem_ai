
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { 
  TriageResponse, 
  ChronicCareResponse, 
  UrgencyLevel,
  MedsResponse,
  EducationResponse,
  AccessibilityResponse,
  ScienceResponse,
  BusinessResponse,
  TechResponse
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

// --- CHAT ---

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: "You are UniGem AI, a universal multimodal assistant. You have deep expertise in Health, Education, Accessibility, Science, Business, and Technology. Your goal is to provide real-time, helpful, and concise answers. Format your responses cleanly. Use bolding (double asterisks) only for key terms. Use bullet points (single asterisk) for lists. Avoid unnecessary decorative symbols or excessive markdown.",
    },
  });
};

// --- HEALTH ---

export const analyzeTriageCase = async (symptoms: string, imageB64?: string, audioB64?: string): Promise<TriageResponse> => {
  const parts: any[] = [];
  const promptText = `
    Role: Senior Triage Nurse Specialist.
    Task: Analyze the patient symptoms, image, and audio to produce a highly accurate triage assessment.
    Constraint: TRIAGE ONLY. DO NOT DIAGNOSE.
    Output Style: Professional, concise, actionable.
    Instructions: 
    1. Determine urgency (Emergency/Urgent/Routine/Home Care) based on standard protocols.
    2. List 3-5 distinct danger signs.
    3. Provide clear, step-by-step action items for the patient.
    4. Formulate specific, medical-grade questions for the clinician handover.
    Context: ${symptoms}.
    JSON Output.
  `;
  parts.push({ text: promptText });
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });
  if (audioB64) parts.push({ inlineData: { mimeType: "audio/webm", data: audioB64 } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          urgency: { type: Type.STRING, enum: Object.values(UrgencyLevel) },
          summary: { type: Type.STRING },
          dangerSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          questionsForClinician: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeChronicLog = async (notes: string, imageB64?: string): Promise<ChronicCareResponse> => {
  const parts: any[] = [{ text: `
    Role: Chronic Condition Management Coach.
    Task: Analyze patient notes/images to track progress and suggest lifestyle adjustments.
    Instructions:
    1. Extract numerical metrics (Blood Pressure, Sugar, Weight, etc.) with dates.
    2. Summarize the patient's current status in an encouraging tone.
    3. Create a checklist of daily tasks (medication, exercise, diet).
    4. Provide specific, evidence-based lifestyle pointers.
    Input: ${notes}
  ` }];
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patientStatusSummary: { type: Type.STRING },
          metrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, value: { type: Type.NUMBER }, unit: { type: Type.STRING }, note: { type: Type.STRING } } } },
          dailyTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestylePointers: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeMeds = async (input: string, imageB64?: string): Promise<MedsResponse> => {
    const parts: any[] = [{ text: `
      Role: Clinical Pharmacist.
      Task: Identify medications from text/image and check for interactions.
      Instructions:
      1. List all identified medications with precise names.
      2. Simplify dosing instructions into "5th grade reading level" language.
      3. Check for drug-drug, drug-food, or drug-condition interactions.
      4. List common side effects to watch for.
      Input: ${input}
    ` }];
    if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });
  
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            simplifiedInstructions: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  };

// --- EDUCATION ---

export const analyzeEducation = async (query: string, imageB64?: string, mode: 'TUTOR' | 'PLAN' | 'GRADER' = 'TUTOR'): Promise<EducationResponse> => {
  let prompt = "";
  if (mode === 'TUTOR') prompt = `Role: Expert Academic Tutor. Explain this concept clearly, provide 3 practice quiz questions, and suggest related topics for deep diving. Query: ${query}`;
  else if (mode === 'PLAN') prompt = `Role: Productive Study Coach. Create a detailed 5-day study plan. For each day, provide a "Focus Theme" and a list of specific, actionable tasks with time estimates. Query: ${query}`;
  else prompt = `Role: Strict Academic Grader. Analyze this assignment. Provide a Letter Grade (A-F). List corrections with specific reasons (cite grammar or logic rules). Write a constructive "Feedback Sandwich" (Praise-Critique-Praise). Input: ${query}`;

  const parts: any[] = [{ text: prompt }];
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          quizQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          studyPlan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, focus: { type: Type.STRING }, tasks: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
          grading: {
              type: Type.OBJECT,
              properties: {
                  grade: { type: Type.STRING },
                  corrections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { original: { type: Type.STRING }, correction: { type: Type.STRING }, reason: { type: Type.STRING } } } },
                  feedback: { type: Type.STRING }
              }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// --- ACCESSIBILITY ---

export const analyzeAccessibility = async (instructions: string, imageB64?: string, mode: 'GENERAL' | 'NAV' = 'GENERAL'): Promise<AccessibilityResponse> => {
  const parts: any[] = [];
  if (mode === 'NAV') {
      parts.push({ text: `
        Role: O&M Specialist (Orientation and Mobility).
        Task: Analyze the environment image for a visually impaired user.
        Instructions:
        1. Identify obstacles/hazards (stairs, chairs, wet floor).
        2. Suggest a clear, safe path.
        3. Use "Clock Face" directions (e.g., "Door is at 12 o'clock").
        Context: ${instructions}
      ` });
  } else {
      const isQA = instructions.includes("?");
      parts.push({ text: isQA ? `Role: Visual Assistant. Answer this question based strictly on the image. Answer: ${instructions}` : `Role: Cognitive Access Helper. Describe the scene simply. Then simplify the provided text into plain language. ${instructions}` });
  }
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          simplifiedText: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
          directAnswer: { type: Type.STRING },
          navigation: {
              type: Type.OBJECT,
              properties: {
                  hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pathSuggestion: { type: Type.STRING },
                  clockDirections: { type: Type.STRING }
              }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// --- SCIENCE ---

export const analyzeScience = async (text: string, imageB64?: string, mode: 'ANALYSIS' | 'DATA' | 'SIM' = 'ANALYSIS'): Promise<ScienceResponse> => {
  let prompt = "";
  if (mode === 'ANALYSIS') prompt = `Role: Senior Research Scientist. Analyze this abstract/paper. Summarize key findings. Propose 3 novel hypotheses based on this work. Critique the methodology for flaws/bias. Input: ${text}`;
  else if (mode === 'DATA') prompt = `Role: Data Scientist. Extract data from this chart/table. Output a Markdown table. List 3 key statistical insights or trends observed in the data. Input: ${text}`;
  else prompt = `Role: Lab Safety Officer & Chemist. Simulate this experiment. Predict the reaction/outcome. List specific safety risks (explosive, toxic). Describe step-by-step what happens visually. Input: ${text}`;

  const parts: any[] = [{ text: prompt }];
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyLiteraturePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          methodologyCritique: { type: Type.STRING },
          extractedData: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, markdownTable: { type: Type.STRING }, insights: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          simulation: {
              type: Type.OBJECT,
              properties: {
                  prediction: { type: Type.STRING },
                  safetyRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stepByStepOutcome: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// --- BUSINESS ---

export const analyzeBusiness = async (query: string, imageB64?: string, mode: 'WORKFLOW' | 'MEETING' | 'CONTRACT' = 'WORKFLOW'): Promise<BusinessResponse> => {
  let prompt = "";
  if (mode === 'WORKFLOW') prompt = `Role: Operations Consultant. Analyze this workflow. Identify bottlenecks. Suggest 3 automation tools (e.g., Zapier, Python script) to improve efficiency. Input: ${query}`;
  else if (mode === 'MEETING') prompt = `Role: Executive Assistant. Transcribe/Summarize this meeting. List participants, key decisions, and assigning precise Action Items (Owner, Task, Deadline). Input: ${query}`;
  else prompt = `Role: Senior Legal Counsel. Review this contract text. Assign a Risk Level (Low/Med/High). List specific red flags (e.g., 'Indemnity clause too broad'). Identify missing standard clauses. Input: ${query}`;

  const parts: any[] = [{ text: prompt }];
  if (imageB64) parts.push({ inlineData: { mimeType: "image/jpeg", data: imageB64 } });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          workflowAnalysis: { type: Type.STRING },
          bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
          automationSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          meetingSummary: { type: Type.OBJECT, properties: { participants: { type: Type.ARRAY, items: { type: Type.STRING } }, decisions: { type: Type.ARRAY, items: { type: Type.STRING } }, actionItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { owner: { type: Type.STRING }, task: { type: Type.STRING }, deadline: { type: Type.STRING } } } } } },
          contractAnalysis: {
              type: Type.OBJECT,
              properties: {
                  riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  summary: { type: Type.STRING }
              }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

// --- TECHNOLOGY ---

export const analyzeTech = async (codeSnippet: string, mode: 'REFACTOR' | 'DEBUG' | 'SECURITY' = 'REFACTOR'): Promise<TechResponse> => {
  let prompt = "";
  if (mode === 'REFACTOR') prompt = `Role: Staff Software Engineer. Refactor this code. Improve performance, readability, and type safety. Generate 3 unit test cases (happy path, edge case, error). Code: ${codeSnippet}`;
  else if (mode === 'DEBUG') prompt = `Role: Senior Debugger. Analyze this error/code. Explain the Root Cause technically. Explain the fix simply. Provide the fixed code snippet. Code: ${codeSnippet}`;
  else prompt = `Role: Security Researcher. Audit this code for vulnerabilities (OWASP Top 10). For each issue, list Severity (Critical/High/Med) and specific line number. Provide a patched version of the code and a Security Score (0-100). Code: ${codeSnippet}`;
  
  const parts: any[] = [{ text: prompt }];
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          codeAnalysis: { type: Type.STRING },
          refactoredCode: { type: Type.STRING },
          testCases: { type: Type.ARRAY, items: { type: Type.STRING } },
          bugAnalysis: { type: Type.OBJECT, properties: { rootCause: { type: Type.STRING }, fixExplanation: { type: Type.STRING }, fixedSnippet: { type: Type.STRING } } },
          securityAudit: {
              type: Type.OBJECT,
              properties: {
                  vulnerabilities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, severity: { type: Type.STRING }, line: { type: Type.NUMBER }, description: { type: Type.STRING } } } },
                  patchedCode: { type: Type.STRING },
                  securityScore: { type: Type.NUMBER }
              }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};


import { GoogleGenAI, Type } from "@google/genai";
import { IntakeData, PickupSpec, FinalDesign, ComparisonAnalysis, BrandHeritage, PersonaStrings, GroundingLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PICKUP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING },
    magnetType: { type: Type.STRING },
    wireGauge: { type: Type.STRING },
    windApproach: { type: Type.STRING },
    dcResistance: { type: Type.STRING },
    windStyle: { type: Type.STRING, enum: ['Underwound', 'Standard', 'Overwound', 'Hot'] },
    windCount: { type: Type.STRING, description: "Total number of turns, e.g., '8,200 turns'" },
    magnetPolarity: { type: Type.STRING, enum: ['North Up' , 'South Up', 'RWRP'] },
    potting: { type: Type.STRING, enum: ['None', 'Light', 'Heavy'] },
    frequencyResponse: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          freq: { type: Type.STRING },
          value: { type: Type.NUMBER }
        },
        required: ['freq', 'value']
      }
    },
    luthierNote: { type: Type.STRING },
    realityCheck: { type: Type.STRING }
  },
  required: ['type', 'magnetType', 'wireGauge', 'windApproach', 'dcResistance', 'potting', 'frequencyResponse', 'luthierNote', 'realityCheck', 'windStyle', 'windCount', 'magnetPolarity']
};

export async function fetchBrandHeritage(): Promise<BrandHeritage> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Research 'Ghostwood Musical Instrument Pickups'. Identify their specific brand voice, unique selling points, and online reputation. Use this to generate a personalized set of UI labels for a custom builder app.",
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          persona: {
            type: Type.OBJECT,
            properties: {
              heroTitle: { type: Type.STRING },
              heroSubtitle: { type: Type.STRING },
              loadingMessage: { type: Type.STRING },
              summaryTitle: { type: Type.STRING },
              manifestTitle: { type: Type.STRING },
              manifestSubtitle: { type: Type.STRING }
            },
            required: ['heroTitle', 'heroSubtitle', 'loadingMessage', 'summaryTitle', 'manifestTitle', 'manifestSubtitle']
          }
        },
        required: ['summary', 'persona']
      }
    }
  });

  const rawData = JSON.parse(response.text);
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || 'External Resource'
    })) || [];

  return { 
    summary: rawData.summary, 
    links, 
    persona: rawData.persona 
  };
}

export async function fetchPickupDemos(): Promise<GroundingLink[]> {
  // Updated search to explicitly look for Shorts and Videos on the specific channel
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Search the YouTube channel '@catfishbisque' (https://www.youtube.com/@catfishbisque) for both standard videos and YouTube Shorts (https://www.youtube.com/@catfishbisque/shorts). Look for pickup demonstrations, shop updates, tonal tests, and winding process clips related to Ghostwood pickups. Return a list of titles and direct links.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const demos: GroundingLink[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web && (chunk.web.uri.includes('youtube.com/watch') || chunk.web.uri.includes('youtube.com/shorts')))
    ?.map(chunk => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || 'Workshop Recording'
    })) || [];

  // Deduplicate and filter out common non-demo links
  const uniqueDemos = Array.from(new Map(demos.map(item => [item.uri, item])).values())
    .filter(demo => !demo.title.toLowerCase().includes('about') && !demo.title.toLowerCase().includes('subscribe'));

  return uniqueDemos;
}

export async function generatePickupDesign(data: IntakeData, brandContext?: string): Promise<PickupSpec> {
  const isRhodes = data.guitarBrand?.toLowerCase().includes('rhodes');
  
  const prompt = isRhodes ? `
    Design a restoration/rewind spec for a Rhodes Electric Piano pickup:
    Instrument: ${data.guitarBrand} (${data.pianoYear})
    Failure Context: ${data.rhodesFailureInfo}
    Tone Goals: ${data.toneGoals.join(', ')}
    Scope: ${data.packSize}
    Rig: ${data.ampType} with ${data.pedalType}
    
    Technical Rules for Rhodes:
    - Target DC Resistance for standard Rhodes is typically ~180-200 Ohms (NOT kOhms).
    - Use 38 AWG or 39 AWG wire for vintage accuracy, or 40 AWG for higher output.
    - Mention the "White Tape" corrosion issue in the luthier notes.
    - Suggest a wind style that balances 'Bark' and 'Tine-Chime' based on the era.
  ` : `
    As an experienced boutique pickup winder at Ghostwood Custom Pickup Studio, design a custom pickup for:
    Style: ${data.style}
    Tone Goals: ${data.toneGoals.join(', ')}
    Guitar: ${data.guitarBrand} ${data.guitarModel} (${data.guitarType}, ${data.bodyWood} body, ${data.scaleLength} scale)
    Route/Size Requirement: ${data.currentRouting}
    Rig Context: Playing through a ${data.ampType} with ${data.pedalType} pedals.
    Performance Profile: ${data.performanceType}
    Issues to fix: ${data.currentIssues}

    Brand Context found online: ${brandContext || "Boutique hand-wound builder focusing on clarity and physics."}

    Rules:
    - PHYSICAL COMPATIBILITY: Suggestion MUST fit ${data.currentRouting}.
    - MAGNET RULE: Use standard magnet types (Alnico 2, 3, 4, 5, 8, or Ceramic).
    - RIG & PERFORMANCE SYNERGY: 
        * If performance is 'Large Stages' or 'High Volume', prioritize wax potting and RF shielding.
        * If performance is 'Studio focus', prioritize maximum harmonic detail and lower output for better transients.
    - LUTHIER NOTE: Reference Ghostwood's specific personality.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: PICKUP_SCHEMA
    }
  });

  return JSON.parse(response.text);
}

export async function recalculateSpec(spec: PickupSpec, intake: IntakeData): Promise<PickupSpec> {
  const prompt = `
    Recalculate pickup specs for a manual adjustment.
    Current: ${spec.type}, ${spec.magnetType}, ${spec.wireGauge}, ${spec.windStyle}.
    Context: ${intake.style}, ${intake.toneGoals.join(', ')}.
    Performance context: ${intake.performanceType}.
    Update DC Resistance, Wind Count, and Frequency Response based on these physical changes.
    If Rhodes, ensure Resistance is in Ohms (~180-250 range).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: PICKUP_SCHEMA
    }
  });

  return JSON.parse(response.text);
}

export async function getComparisonAnalysis(designA: FinalDesign, designB: FinalDesign): Promise<ComparisonAnalysis> {
  const prompt = `
    Compare two Ghostwood designs:
    A: ${designA.pickup.type}, ${designA.pickup.magnetType}, ${designA.pickup.windStyle}
    B: ${designB.pickup.type}, ${designB.pickup.magnetType}, ${designB.pickup.windStyle}
    Explain the tonal differences based on winding count and magnet type.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tonalDifference: { type: Type.STRING },
          playingExperience: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ['tonalDifference', 'playingExperience', 'recommendation']
      }
    }
  });

  return JSON.parse(response.text);
}

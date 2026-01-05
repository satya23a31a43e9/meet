
import { GoogleGenAI, Type } from "@google/genai";
import { MeetingData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are an expert AI meeting assistant. Your task is to analyze meeting transcript segments and maintain a structured, consolidated view of the meeting.

RULES:
1. Merge new information into existing context. Do not repeat unchanged points unless necessary for context.
2. Be concise and professional.
3. If information is incomplete, use "TBD".
4. Always return valid JSON matching the schema provided.

Output format should follow this structure exactly:
- Summary: 2-4 bullet points.
- Discussion Points: Key topics discussed.
- Decisions: Clear decisions made.
- Action Items: Array of objects { task, owner, deadline }.
- Risks/Follow-ups: Identified risks or blockers.
`;

export async function analyzeMeetingSegment(
  newSegment: string,
  previousContext?: MeetingData
): Promise<MeetingData> {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      NEW TRANSCRIPT SEGMENT:
      "${newSegment}"

      PREVIOUS CONSOLIDATED DATA (FOR CONTEXT):
      ${previousContext ? JSON.stringify(previousContext) : 'None (First segment)'}

      Analyze the segment and provide the updated consolidated meeting data in JSON format.
    `,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-4 concise bullet points summarizing the meeting status."
          },
          discussionPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key themes and topics covered."
          },
          decisions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concrete decisions reached."
          },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                owner: { type: Type.STRING },
                deadline: { type: Type.STRING }
              },
              required: ["task", "owner", "deadline"]
            }
          },
          risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Blockers, risks, or follow-up items."
          }
        },
        required: ["summary", "discussionPoints", "decisions", "actionItems", "risks"]
      }
    }
  });

  try {
    const result = await model;
    const jsonStr = result.text.trim();
    return JSON.parse(jsonStr) as MeetingData;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}

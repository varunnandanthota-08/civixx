import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  // Initialize the OpenAI SDK targeting the Featherless API
  // Note: NEXT_PUBLIC_ is NOT used to protect the API key from the client.
  const client = new OpenAI({
    baseURL: 'https://api.featherless.ai/v1',
    apiKey: process.env.FEATHERLESS_API_KEY || 'DUMMY_KEY_FOR_BUILD',
  });
  try {
    const body = await req.json();
    const { complaint } = body;

    if (!complaint || typeof complaint !== 'string' || complaint.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid or missing complaint text.' }, { status: 400 });
    }

    console.log("[CivicAI] Running from:", process.cwd());
    const apiKey = process.env.FEATHERLESS_API_KEY;
    const model = process.env.FEATHERLESS_MODEL;

    console.log("[CivicAI] FEATHERLESS_API_KEY loaded:", Boolean(apiKey));
    console.log("[CivicAI] FEATHERLESS_MODEL:", model || "MISSING");

    if (!apiKey) {
      console.error("[CivicAI] FEATHERLESS_API_KEY is missing");
      return NextResponse.json({ error: 'FEATHERLESS_API_KEY missing' }, { status: 500 });
    }

    if (!model) {
      console.error("[CivicAI] FEATHERLESS_MODEL is missing");
      return NextResponse.json({ error: 'FEATHERLESS_MODEL missing' }, { status: 500 });
    }

    console.log('[CivicAI] Received grievance:', complaint.substring(0, 50) + '...');
    console.log('[CivicAI] Calling Featherless API...');

    const systemPrompt = `You are CivicAI, an AI civic grievance analysis engine. Your job is to analyze citizen complaints for a government grievance-management system.

You MUST return ONLY valid JSON and absolutely no markdown formatting, backticks, or extra explanation outside the JSON object.

Extract and return exactly these fields based on the complaint:
- "category": string (e.g., Water Supply, Sanitation, Roads, Electricity, Drainage, Public Safety)
- "department": string (guess the responsible government department, e.g., Water Supply Department)
- "severity": integer from 1-10 (how serious the underlying public-service problem is)
- "urgency": integer from 1-10 (how quickly authorities need to respond)
- "publicImpact": integer from 1-10 (how many citizens or how much public infrastructure may be affected)
- "vulnerability": integer from 1-10 (whether vulnerable people or essential needs are involved)
- "recurrence": integer from 1-10 (whether the complaint indicates a repeated/ongoing issue)
- "location": string (extracted location/landmark if available, or "Unknown")
- "summary": string (a concise 1-sentence summary of the core issue)
- "reasoning": string (a concise explanation of why you assigned these specific severity and urgency scores)
- "recommendedAction": string (a brief suggested immediate next step for the department)`;

    const modelId = process.env.FEATHERLESS_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

    let response;
    try {
      response = await client.chat.completions.create({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: complaint }
        ],
        temperature: 0.1, // Keep it deterministic
      }, {
        headers: {
          'X-Title': 'CivicAI',
          'HTTP-Referer': 'http://localhost:3000'
        }
      });
    } catch (apiError: any) {
      const status = apiError.status || 500;
      const errorBody = apiError.error ? apiError.error.message : apiError.message;
      
      console.error("[CivicAI] Featherless status:", status);
      console.error("[CivicAI] Featherless error:", errorBody);
      
      return NextResponse.json({
        error: "Featherless API request failed",
        status: status,
        details: errorBody
      }, { status: status });
    }

    console.log('[CivicAI] AI response received.');

    const resultText = response.choices[0]?.message?.content?.trim();
    
    if (!resultText) {
      throw new Error('Empty response from AI model');
    }

    // Try to parse the JSON output from the model. Handle accidental markdown code blocks if the model fails instructions.
    let parsedJson;
    try {
      const cleanText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('[CivicAI] Failed to parse JSON from AI model:', resultText);
      return NextResponse.json({ error: 'AI returned malformed data.' }, { status: 502 });
    }

    // Validate scoring bounds
    const clamp = (val: any) => Math.max(1, Math.min(10, parseInt(val, 10) || 5));
    
    parsedJson.severity = clamp(parsedJson.severity);
    parsedJson.urgency = clamp(parsedJson.urgency);
    parsedJson.publicImpact = clamp(parsedJson.publicImpact);
    parsedJson.vulnerability = clamp(parsedJson.vulnerability);
    parsedJson.recurrence = clamp(parsedJson.recurrence);
    
    if (!parsedJson.category || !parsedJson.department || !parsedJson.reasoning || !parsedJson.recommendedAction) {
       console.error('[CivicAI] AI JSON is missing required fields.', parsedJson);
       return NextResponse.json({ error: 'AI output missing required fields.' }, { status: 502 });
    }

    return NextResponse.json(parsedJson);

  } catch (error: any) {
    console.error('[CivicAI] Unexpected server error during analysis:', error.message || error);
    return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 500 });
  }
}

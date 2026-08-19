/**
 * Deterministic fallback analysis when Featherless API is unavailable.
 * Used only for hackathon demos when FEATHERLESS_API_KEY is not configured.
 */
export interface DemoAnalysisResult {
  category: string;
  department: string;
  severity: number;
  urgency: number;
  publicImpact: number;
  vulnerability: number;
  recurrence: number;
  location: string;
  summary: string;
  reasoning: string;
  recommendedAction: string;
}

const CATEGORY_RULES: Array<{
  keywords: string[];
  category: string;
  department: string;
  baseSeverity: number;
  baseUrgency: number;
  recommendedAction: string;
}> = [
  {
    keywords: ['water', 'drinking', 'supply', 'tap', 'pipeline'],
    category: 'Water Supply',
    department: 'Water Supply Department',
    baseSeverity: 8,
    baseUrgency: 8,
    recommendedAction: 'Dispatch water tanker and inspect pipeline within 4 hours.',
  },
  {
    keywords: ['garbage', 'waste', 'sanitation', 'dump', 'trash', 'sewage'],
    category: 'Sanitation',
    department: 'Municipal Sanitation Department',
    baseSeverity: 7,
    baseUrgency: 7,
    recommendedAction: 'Schedule immediate cleanup crew and assess recurring dump sites.',
  },
  {
    keywords: ['road', 'pothole', 'pavement', 'street', 'footpath'],
    category: 'Roads',
    department: 'Public Works Department',
    baseSeverity: 6,
    baseUrgency: 6,
    recommendedAction: 'Inspect road segment and schedule repair within 48 hours.',
  },
  {
    keywords: ['electric', 'power', 'transformer', 'outage', 'streetlight', 'light'],
    category: 'Electricity',
    department: 'Electricity Board',
    baseSeverity: 7,
    baseUrgency: 8,
    recommendedAction: 'Dispatch electrical maintenance team to restore service.',
  },
  {
    keywords: ['drain', 'drainage', 'flood', 'waterlogging', 'monsoon'],
    category: 'Drainage',
    department: 'Stormwater Management Department',
    baseSeverity: 8,
    baseUrgency: 8,
    recommendedAction: 'Clear drainage blockage and monitor low-lying areas.',
  },
  {
    keywords: ['crime', 'theft', 'safety', 'harassment', 'accident', 'fire'],
    category: 'Public Safety',
    department: 'Public Safety & Emergency Services',
    baseSeverity: 9,
    baseUrgency: 9,
    recommendedAction: 'Escalate to emergency response and notify local authorities immediately.',
  },
];

function clamp(value: number): number {
  return Math.max(1, Math.min(10, value));
}

function extractLocation(text: string): string {
  const locationPatterns = [
    /(?:in|at|near|from)\s+([A-Z][A-Za-z0-9\s,.-]{2,40})/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*(?:Sector|Zone|Ward)\s*\d+)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().replace(/\.$/, '');
    }
  }

  return 'Unknown';
}

function summarize(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= 120) return cleaned;
  return `${cleaned.slice(0, 117)}...`;
}

export function generateDemoAnalysis(complaint: string): DemoAnalysisResult {
  const lower = complaint.toLowerCase();

  const matchedRule =
    CATEGORY_RULES.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword))) ??
    CATEGORY_RULES[0];

  const hasVulnerablePopulation =
    /(\bold\b|elderly|senior|child|children|pregnant|disabled|hospital|patient)/i.test(
      complaint
    );
  const indicatesRecurrence =
    /(\bdays?\b|\bweeks?\b|\bmonths?\b|\brepeated\b|\bongoing\b|\bstill\b|\bagain\b)/i.test(
      complaint
    );
  const indicatesWidespread =
    /(\blocality\b|\barea\b|\bneighborhood\b|\bcolony\b|\bresidents\b|\bcommunity\b)/i.test(
      complaint
    );

  const severity = clamp(
    matchedRule.baseSeverity + (hasVulnerablePopulation ? 1 : 0) + (indicatesWidespread ? 1 : 0)
  );
  const urgency = clamp(
    matchedRule.baseUrgency + (hasVulnerablePopulation ? 1 : 0) + (indicatesRecurrence ? 1 : 0)
  );
  const publicImpact = clamp(indicatesWidespread ? 8 : 6);
  const vulnerability = clamp(hasVulnerablePopulation ? 9 : 5);
  const recurrence = clamp(indicatesRecurrence ? 8 : 4);

  const reasoningParts = [
    `Classified as ${matchedRule.category} based on complaint keywords.`,
    hasVulnerablePopulation
      ? 'Vulnerable population mentioned, increasing severity and urgency.'
      : 'No explicit vulnerable-population indicators detected.',
    indicatesRecurrence
      ? 'Language suggests a recurring or prolonged issue.'
      : 'Issue appears recent or isolated from the description.',
  ];

  return {
    category: matchedRule.category,
    department: matchedRule.department,
    severity,
    urgency,
    publicImpact,
    vulnerability,
    recurrence,
    location: extractLocation(complaint),
    summary: summarize(complaint),
    reasoning: reasoningParts.join(' '),
    recommendedAction: matchedRule.recommendedAction,
  };
}

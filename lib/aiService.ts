import { Grievance, DepartmentKnowledge } from './types';
import { fetchAndParseGrievances, fetchAndParseDepartments, calculateDeterministicPriority, findRelatedHistoricalGrievances } from './dataUtils';

export interface AIAnalysisResult {
  grievanceId: string;
  originalText: string;
  category: string;
  department: string;
  severity: number;
  urgency: number;
  public_impact: number;
  vulnerability: number;
  priorityScore: number;
  priority: string;
  explanation: string;
  similarComplaints: Array<{
    id: string;
    title: string;
    similarity: number;
    location: string;
    createdAt: string;
  }>;
  possibleSystemicIssue: boolean;
  systemicIssueDescription: string;
  recommendedAction: string;
  suggestedSLA: string;
  escalationLevel: string;
  recommendedNextStep: string;
}

// Memory cache for client side matching
let cachedGrievances: Grievance[] | null = null;
let cachedDepartments: DepartmentKnowledge[] | null = null;

async function ensureDataLoaded() {
  if (!cachedGrievances) {
    cachedGrievances = await fetchAndParseGrievances();
  }
  if (!cachedDepartments) {
    cachedDepartments = await fetchAndParseDepartments();
  }
}

export function generatePriorityExplanation(grievance: Partial<Grievance>): string {
  const reasons: string[] = [];
  if ((grievance.severity || 0) >= 8) reasons.push("High service severity contributes significantly to the priority.");
  if ((grievance.urgency || 0) >= 8) reasons.push("Immediate attention is recommended due to the urgency of the grievance.");
  if ((grievance.public_impact || 0) >= 8) reasons.push("High public impact indicates widespread disruption.");
  if ((grievance.vulnerability || 0) >= 8) reasons.push("Vulnerable populations are affected, demanding rapid response.");
  if ((grievance.related_complaint_count || 0) > 5) reasons.push("Multiple related grievances indicate this may affect a wider population.");
  if (grievance.systemic_cluster === "Yes") reasons.push("This grievance belongs to a larger potential systemic issue.");
  
  if (reasons.length === 0) return "Routine grievance processing based on standard SLA parameters.";
  return reasons.join(" ");
}

export async function findRelatedComplaints(clusterId: string | null): Promise<Grievance[]> {
  await ensureDataLoaded();
  if (!clusterId || !cachedGrievances) return [];
  
  return cachedGrievances
    .filter(g => g.duplicate_cluster_id === clusterId)
    .sort((a, b) => (b.semantic_similarity || 0) - (a.semantic_similarity || 0));
}

export async function getDepartmentKnowledge(departmentName: string): Promise<DepartmentKnowledge | null> {
  await ensureDataLoaded();
  if (!cachedDepartments) return null;
  // Match department loosely to ensure API variations hook up correctly
  const normalizedDeptName = departmentName.toLowerCase();
  return cachedDepartments.find(d => d.department.toLowerCase() === normalizedDeptName || normalizedDeptName.includes(d.department.toLowerCase())) || null;
}

export async function analyzeGrievance(text: string, locationInput?: string): Promise<AIAnalysisResult> {
  await ensureDataLoaded();
  
  // 1. Call real Featherless AI Server Endpoint
  const response = await fetch('/api/analyze-grievance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint: text })
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'AI service temporarily unavailable');
  }

  const aiData = await response.json();
  
  // 2. Perform Deterministic Priority Calculation securely on the application side
  const { score, priority } = calculateDeterministicPriority(
    aiData.severity,
    aiData.urgency,
    aiData.publicImpact,
    aiData.vulnerability,
    aiData.recurrence
  );

  // 3. Department Knowledge Lookup
  const deptInfo = await getDepartmentKnowledge(aiData.department);
  const matchedDeptName = deptInfo ? deptInfo.department : aiData.department;
  
  // 4. Historical Dataset Matching
  const relatedGrievances = findRelatedHistoricalGrievances(
    text,
    aiData.category,
    matchedDeptName,
    aiData.location !== 'Unknown' ? aiData.location : (locationInput || ''),
    cachedGrievances || []
  );

  const generatedId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;

  // Assemble the unified response for the UI
  return {
    grievanceId: generatedId,
    originalText: text,
    category: aiData.category,
    department: matchedDeptName,
    severity: aiData.severity,
    urgency: aiData.urgency,
    public_impact: aiData.publicImpact,
    vulnerability: aiData.vulnerability,
    priorityScore: score,
    priority: priority,
    explanation: aiData.reasoning, // Use real AI reasoning
    similarComplaints: relatedGrievances.map((r, i) => ({
      id: r.grievance_id,
      title: r.citizen_text,
      similarity: 90 - (i * 2), // Mock percentage for UI ranking
      location: r.location,
      createdAt: new Date(r.created_at).toLocaleDateString()
    })),
    possibleSystemicIssue: relatedGrievances.length > 2,
    systemicIssueDescription: relatedGrievances.length > 2 
        ? `AI matched this with ${relatedGrievances.length} recent similar complaints in the dataset, indicating a possible cluster.` 
        : `This appears to be an isolated incident based on current data.`,
    recommendedAction: deptInfo?.recommended_resolution_steps || aiData.recommendedAction,
    suggestedSLA: deptInfo?.sla_policy || 'Standard 48 Hours',
    escalationLevel: deptInfo?.escalation_owner || 'General Support Queue',
    recommendedNextStep: 'Log into system and notify dispatch.'
  };
}

// Deprecated mock logic mapping
export const analyzeAgainstHistoricalData = analyzeGrievance;

export interface Grievance {
  grievance_id: string;
  created_at: string;
  channel: string;
  citizen_text: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  department: string;
  severity: number;
  urgency: number;
  public_impact: number;
  vulnerability: number;
  recurrence: number;
  priority_score: number;
  priority: string;
  status: string;
  duplicate_cluster_id: string | null;
  related_complaint_count: number;
  semantic_similarity: number | null;
  sentiment: string;
  sla_hours: number;
  recommended_action: string;
  actual_resolution_hours: number | null;
  systemic_cluster: string;
  workflowCreatedAt?: string;
  workflowSlaStatus?: 'SLA Met' | 'SLA Breached';
  workflowTimeRemaining?: string;
  resolutionNote?: string;
  history?: ResolutionEvent[];
}

export type CitizenGrievanceStatus = 'Registered' | 'AI Analyzed' | 'Assigned' | 'Confirmed Assigned' | 'In Progress' | 'Resolved';

export interface ResolutionEvent {
  status: CitizenGrievanceStatus;
  timestamp: string;
  department: string;
  action: string;
}

export interface CitizenGrievance {
  grievanceId: string;
  createdAt: string;
  suggestedSLAHours: number;
  status: CitizenGrievanceStatus;
  feedbackRating: number | null;
  feedbackComment: string;
  feedbackSubmittedAt: string | null;
  description: string;
  location: string;
  phone: string;
  department: string;
  category: string;
  priority: string;
  priorityScore: number;
  recommendedAction: string;
  finalResolutionNote: string;
  history: ResolutionEvent[];
  rewardEvents: string[];
  assignedDepartment?: string;
  assignedOfficer?: string;
  statusUpdatedAt?: string;
  resolutionNote?: string;
  resolvedAt?: string;
}

export interface DepartmentKnowledge {
  department: string;
  responsibilities: string;
  sla_policy: string;
  escalation_owner: string;
  recommended_resolution_steps: string;
}

import Papa from 'papaparse';
import { Grievance, DepartmentKnowledge } from './types';

export async function fetchAndParseGrievances(): Promise<Grievance[]> {
  try {
    const response = await fetch('/data/civicai_grievances_1000.csv');
    if (!response.ok) {
      console.warn('Could not fetch civicai_grievances_1000.csv. Returning empty array.');
      return [];
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data: Grievance[] = results.data.map((row: any) => ({
            grievance_id: row.grievance_id || '',
            created_at: row.created_at || '',
            channel: row.channel || '',
            citizen_text: row.citizen_text || '',
            category: row.category || 'Other',
            location: row.location || '',
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            department: row.department || '',
            severity: parseInt(row.severity, 10) || 0,
            urgency: parseInt(row.urgency, 10) || 0,
            public_impact: parseInt(row.public_impact, 10) || 0,
            vulnerability: parseInt(row.vulnerability, 10) || 0,
            recurrence: parseInt(row.recurrence, 10) || 0,
            priority_score: parseInt(row.priority_score, 10) || 0,
            priority: row.priority || 'Low',
            status: row.status || 'New',
            duplicate_cluster_id: row.duplicate_cluster_id ? row.duplicate_cluster_id : null,
            related_complaint_count: parseInt(row.related_complaint_count, 10) || 0,
            semantic_similarity: row.semantic_similarity ? parseFloat(row.semantic_similarity) : null,
            sentiment: row.sentiment || '',
            sla_hours: parseInt(row.sla_hours, 10) || 0,
            recommended_action: row.recommended_action || '',
            actual_resolution_hours: row.actual_resolution_hours ? parseFloat(row.actual_resolution_hours) : null,
            systemic_cluster: row.systemic_cluster || 'No',
          }));
          resolve(data);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching grievances dataset:', error);
    return [];
  }
}

export async function fetchAndParseDepartments(): Promise<DepartmentKnowledge[]> {
  try {
    const response = await fetch('/data/civicai_department_knowledge_base.csv');
    if (!response.ok) {
      console.warn('Could not fetch department knowledge base. Returning empty array.');
      return [];
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data: DepartmentKnowledge[] = results.data.map((row: any) => ({
            department: row.department || '',
            responsibilities: row.responsibilities || '',
            sla_policy: row.sla_policy || '',
            escalation_owner: row.escalation_owner || '',
            recommended_resolution_steps: row.recommended_resolution_steps || '',
          }));
          resolve(data);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching departments dataset:', error);
    return [];
  }
}

// AI Pattern Detection Utilities

export function detectRecurringProblems(grievances: Grievance[]) {
  const locationStats: Record<string, { count: number; totalRecurrence: number }> = {};
  
  grievances.forEach((g) => {
    if (g.recurrence > 5) {
      const key = `${g.location} - ${g.category}`;
      if (!locationStats[key]) locationStats[key] = { count: 0, totalRecurrence: 0 };
      locationStats[key].count += 1;
      locationStats[key].totalRecurrence += g.recurrence;
    }
  });

  const sorted = Object.entries(locationStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);
    
  return sorted.map(([key, stats]) => ({
    problemKey: key,
    count: stats.count,
    avgRecurrence: (stats.totalRecurrence / stats.count).toFixed(1)
  }));
}

export function detectSpatialConcentration(grievances: Grievance[]) {
  const locationCounts: Record<string, number> = {};
  let total = 0;
  
  grievances.forEach((g) => {
    locationCounts[g.location] = (locationCounts[g.location] || 0) + 1;
    total++;
  });
  
  const sorted = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  
  const top = sorted[0];
  const percentage = total > 0 ? ((top[1] / total) * 100).toFixed(1) : '0';
  
  return {
    location: top[0],
    percentage,
    count: top[1]
  };
}

export function detectDuplicateClusters(grievances: Grievance[]) {
  const clusters: Record<string, Grievance[]> = {};
  
  grievances.forEach((g) => {
    if (g.duplicate_cluster_id && g.duplicate_cluster_id.startsWith('CL-')) {
      if (!clusters[g.duplicate_cluster_id]) clusters[g.duplicate_cluster_id] = [];
      clusters[g.duplicate_cluster_id].push(g);
    }
  });
  
  const sorted = Object.entries(clusters).sort((a, b) => b[1].length - a[1].length);
  if (sorted.length === 0) return null;
  
  const topCluster = sorted[0];
  return {
    clusterId: topCluster[0],
    size: topCluster[1].length,
    category: topCluster[1][0].category
  };
}

export function detectEscalationRisk(grievances: Grievance[]) {
  const risks = grievances.filter(g => 
    g.status !== 'Resolved' && 
    (g.priority === 'Critical' || g.priority === 'High') &&
    g.sla_hours < 24 &&
    (g.severity > 7 || g.urgency > 7)
  );
  
  return {
    riskCount: risks.length,
    highestRiskItems: risks.sort((a, b) => b.priority_score - a.priority_score).slice(0, 5)
  };
}

// ---------------------------------------------------------
// NEW DETERMINISTIC PRIORITIZATION AND MATCHING UTILITIES
// ---------------------------------------------------------

export function calculateDeterministicPriority(
  severity: number,
  urgency: number,
  publicImpact: number,
  vulnerability: number,
  recurrence: number
): { score: number; priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' } {
  // Normalize constraints
  const s = Math.max(1, Math.min(10, severity));
  const u = Math.max(1, Math.min(10, urgency));
  const p = Math.max(1, Math.min(10, publicImpact));
  const v = Math.max(1, Math.min(10, vulnerability));
  const r = Math.max(1, Math.min(10, recurrence));

  const rawScore = (0.30 * s) + (0.20 * u) + (0.20 * p) + (0.15 * v) + (0.15 * r);
  const priorityScore = Math.round(rawScore * 10); // scale 1-10 to 1-100

  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (priorityScore >= 85) priority = 'CRITICAL';
  else if (priorityScore >= 70) priority = 'HIGH';
  else if (priorityScore >= 50) priority = 'MEDIUM';

  return { score: priorityScore, priority };
}

export function findRelatedHistoricalGrievances(
  complaintText: string,
  category: string,
  department: string,
  location: string,
  allGrievances: Grievance[]
): Grievance[] {
  // Very lightweight deterministic text and attribute matching
  const keywords = complaintText.toLowerCase().split(' ').filter(w => w.length > 4);
  const locTarget = location?.toLowerCase() || '';

  const scored = allGrievances.map(g => {
    let score = 0;
    
    // Category match
    if (g.category === category) score += 30;
    
    // Department match
    if (g.department === department) score += 20;

    // Location match
    if (locTarget && g.location.toLowerCase().includes(locTarget)) score += 30;

    // Keyword match
    const textLower = g.citizen_text.toLowerCase();
    keywords.forEach(kw => {
      if (textLower.includes(kw)) score += 5;
    });

    return { grievance: g, score };
  });

  return scored
    .filter(s => s.score > 40) // Minimum threshold to be considered related
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Return top 5
    .map(s => s.grievance);
}

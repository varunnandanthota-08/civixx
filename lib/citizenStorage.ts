import { CitizenGrievance, CitizenGrievanceStatus, ResolutionEvent } from './types';
import { OfficerDepartment, getCurrentUser } from './auth';
import { normalizeDepartment, toCanonicalDepartment } from './departments';

const GRIEVANCES_KEY = 'civicai_citizen_grievances';
const REWARDS_KEY = 'civicai_citizen_rewards';
const SESSION_KEY = 'civicai_session';
export const GRIEVANCES_CHANGE_EVENT = 'civicai-grievances-change';

export interface CitizenRewardState {
  points: number;
  successfulComplaints: number;
  events: string[];
}

export interface LeaderboardEntry {
  citizen: string;
  successfulComplaints: number;
  points: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

export function getCitizenSession(): string {
  const session = read<{ identifier?: string }> (SESSION_KEY, {});
  return session.identifier || 'citizen@civicai.demo';
}

export function getCitizenGrievances(): CitizenGrievance[] {
  return getStoredGrievances();
}

export function getStoredGrievances(): CitizenGrievance[] {
  return read<CitizenGrievance[]>(GRIEVANCES_KEY, []).map((grievance) => ({
    ...grievance,
    department: toCanonicalDepartment(grievance.department) || grievance.department.trim(),
    status: grievance.status === 'Assigned' ? 'Confirmed Assigned' : grievance.status,
    assignedDepartment: grievance.assignedDepartment || grievance.department,
    statusUpdatedAt: grievance.statusUpdatedAt || grievance.createdAt,
    resolutionNote: grievance.resolutionNote || grievance.finalResolutionNote || '',
  }));
}

export function saveCitizenGrievances(grievances: CitizenGrievance[]): void {
  write(GRIEVANCES_KEY, grievances);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(GRIEVANCES_CHANGE_EVENT));
}

export function addCitizenGrievance(grievance: CitizenGrievance): void {
  saveCitizenGrievances([grievance, ...getCitizenGrievances()]);
}

export function getGrievancesForDepartment(department?: OfficerDepartment): CitizenGrievance[] {
  const user = getCurrentUser();
  const targetDepartment = department || user?.department;
  const grievances = getStoredGrievances();
  return user?.role === 'admin' || targetDepartment === 'Admin'
    ? grievances
    : grievances.filter((grievance) => normalizeDepartment(grievance.department) === normalizeDepartment(targetDepartment));
}

export function updateCitizenGrievance(
  grievanceId: string,
  update: (grievance: CitizenGrievance) => CitizenGrievance
): CitizenGrievance | null {
  let updated: CitizenGrievance | null = null;
  const grievances = getCitizenGrievances().map((grievance) => {
    if (grievance.grievanceId !== grievanceId) return grievance;
    updated = update(grievance);
    return updated;
  });
  saveCitizenGrievances(grievances);
  return updated;
}

export function parseSLAHours(sla: string): number {
  const match = sla.match(/(\d+)\s*hour/i);
  return match ? Number(match[1]) : 48;
}

export function isSlaExpired(grievance: CitizenGrievance, now = Date.now()): boolean {
  return now >= new Date(grievance.createdAt).getTime() + grievance.suggestedSLAHours * 3600000;
}

export function getSlaStatus(grievance: CitizenGrievance, now = Date.now()): 'SLA Met' | 'SLA Breached' {
  if (grievance.status !== 'Resolved') return isSlaExpired(grievance, now) ? 'SLA Breached' : 'SLA Met';
  const resolved = grievance.history.find((event) => event.status === 'Resolved');
  return resolved && new Date(resolved.timestamp).getTime() > new Date(grievance.createdAt).getTime() + grievance.suggestedSLAHours * 3600000
    ? 'SLA Breached'
    : 'SLA Met';
}

export function formatCountdown(grievance: CitizenGrievance, now = Date.now()): string {
  const remaining = new Date(grievance.createdAt).getTime() + grievance.suggestedSLAHours * 3600000 - now;
  if (remaining <= 0) return 'SLA expired';
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  return `${hours}h ${minutes}m remaining`;
}

export function updateGrievanceStatus(
  grievanceId: string,
  status: CitizenGrievanceStatus,
  action: string,
  note = '',
  assignedOfficer = getCurrentUser()?.identifier || ''
): CitizenGrievance | null {
  return updateCitizenGrievance(grievanceId, (grievance) => {
    if (grievance.status === status) return grievance;
    const updatedAt = new Date().toISOString();
    const event: ResolutionEvent = {
      status,
      timestamp: updatedAt,
      department: grievance.assignedDepartment || grievance.department,
      action: assignedOfficer ? `${action} (${assignedOfficer})` : action,
    };
    return {
      ...grievance,
      status,
      assignedDepartment: grievance.assignedDepartment || grievance.department,
      assignedOfficer: assignedOfficer || grievance.assignedOfficer,
      statusUpdatedAt: updatedAt,
      resolutionNote: note || grievance.resolutionNote,
      finalResolutionNote: note || grievance.finalResolutionNote,
      resolvedAt: status === 'Resolved' ? updatedAt : grievance.resolvedAt,
      history: [...grievance.history, event],
    };
  });
}

export function addResolutionEvent(grievanceId: string, status: CitizenGrievanceStatus, action: string, note = ''): CitizenGrievance | null {
  return updateGrievanceStatus(grievanceId, status, action, note);
}

export function getRewardState(): CitizenRewardState {
  return read<CitizenRewardState>(REWARDS_KEY, { points: 0, successfulComplaints: 0, events: [] });
}

export function awardReward(event: string, points: number, successfulComplaints = false): CitizenRewardState {
  const current = getRewardState();
  if (current.events.includes(event)) return current;
  const next = {
    points: current.points + points,
    successfulComplaints: current.successfulComplaints + (successfulComplaints ? 1 : 0),
    events: [...current.events, event],
  };
  write(REWARDS_KEY, next);
  return next;
}

export function getLeaderboard(): LeaderboardEntry[] {
  const current = getRewardState();
  return [
    { citizen: 'Ananya Sharma', successfulComplaints: 18, points: 420 },
    { citizen: 'Rahul Verma', successfulComplaints: 11, points: 280 },
    { citizen: getCitizenSession(), successfulComplaints: current.successfulComplaints, points: current.points },
    { citizen: 'Priya Nair', successfulComplaints: 6, points: 165 },
  ].sort((a, b) => b.points - a.points);
}

export function getRewardLevel(points: number): string {
  return points >= 250 ? 'Civic Leader' : points >= 100 ? 'Civic Champion' : 'Civic Contributor';
}
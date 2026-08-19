export type UserRole = 'citizen' | 'officer' | 'admin';

export type OfficerDepartment = 'Drainage' | 'Electricity' | 'Public Safety' | 'Roads' | 'Sanitation' | 'Water Supply' | 'Admin';

export interface SessionUser {
  role: UserRole;
  department?: OfficerDepartment;
  identifier?: string;
}

export interface DemoUser {
  role: UserRole;
  identifier: string;
  password: string;
  department?: OfficerDepartment;
}

const SESSION_KEY = 'civicai_session';
export const AUTH_CHANGE_EVENT = 'civicai-auth-change';

/** Hackathon demo credentials — not for production use. */
export const demoUsers: DemoUser[] = [
  {
    role: 'citizen',
    identifier: 'citizen@civicai.demo',
    password: 'citizen123',
  },
  ...(['Drainage', 'Electricity', 'Public Safety', 'Roads', 'Sanitation', 'Water Supply'] as OfficerDepartment[]).map((department) => ({ role: 'officer' as const, identifier: `${department.toLowerCase().replace(/ /g, '')}@civicai.demo`, password: `${department.toLowerCase().replace(/ /g, '')}123`, department })),
  { role: 'admin', identifier: 'admin@civicai.demo', password: 'admin123', department: 'Admin' },
];

function notifyAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function getCurrentUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SessionUser;
    if (parsed.role === 'citizen' || parsed.role === 'officer' || parsed.role === 'admin') {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function getUserRole(): UserRole | null {
  return getCurrentUser()?.role ?? null;
}

export function hasRole(role: UserRole): boolean {
  return getUserRole() === role;
}

export function getDashboardPath(role: UserRole): string {
  return role === 'citizen' ? '/citizen' : '/officer';
}

export function login(
  role: UserRole,
  identifier: string,
  password: string,
  department?: OfficerDepartment
): { success: true } | { success: false; error: string } {
  const normalizedIdentifier = identifier.trim();
  const matchedUser = demoUsers.find(
    (user) =>
      user.role === role &&
      user.identifier === normalizedIdentifier &&
      user.password === password &&
      (role === 'citizen' || user.department === department)
  );

  if (!matchedUser) {
    return {
      success: false,
      error: 'Invalid credentials. Please check your details.',
    };
  }

  const session: SessionUser = { role: matchedUser.role, identifier: matchedUser.identifier, department: matchedUser.department };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifyAuthChange();

  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChange();
}

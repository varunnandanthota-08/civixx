export type UserRole = 'citizen' | 'officer';

export interface SessionUser {
  role: UserRole;
}

export interface DemoUser {
  role: UserRole;
  identifier: string;
  password: string;
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
  {
    role: 'officer',
    identifier: 'officer@civicai.demo',
    password: 'officer123',
  },
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
    if (parsed.role === 'citizen' || parsed.role === 'officer') {
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
  password: string
): { success: true } | { success: false; error: string } {
  const normalizedIdentifier = identifier.trim();
  const matchedUser = demoUsers.find(
    (user) =>
      user.role === role &&
      user.identifier === normalizedIdentifier &&
      user.password === password
  );

  if (!matchedUser) {
    return {
      success: false,
      error: 'Invalid credentials. Please check your details.',
    };
  }

  const session: SessionUser = { role: matchedUser.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifyAuthChange();

  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChange();
}

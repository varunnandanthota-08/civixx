import { OfficerDepartment } from './auth';

export const CANONICAL_DEPARTMENTS: OfficerDepartment[] = [
  'Drainage',
  'Electricity',
  'Public Safety',
  'Roads',
  'Sanitation',
  'Water Supply',
];

export function normalizeDepartment(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function toCanonicalDepartment(value: string | null | undefined): OfficerDepartment | null {
  const normalized = normalizeDepartment(value);
  if (!normalized) return null;

  const match = CANONICAL_DEPARTMENTS.find((department) => {
    const canonical = normalizeDepartment(department);
    const withoutSuffix = normalized.replace(/\s+department$/, '').replace(/^ghmc\s+/, '');
    return normalized === canonical || withoutSuffix === canonical;
  });

  return match || null;
}
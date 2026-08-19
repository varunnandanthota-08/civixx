import { RouteGuard } from '@/components/auth/RouteGuard';

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={['officer']}>{children}</RouteGuard>;
}

import { RouteGuard } from '@/components/auth/RouteGuard';

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={['officer']}>{children}</RouteGuard>;
}

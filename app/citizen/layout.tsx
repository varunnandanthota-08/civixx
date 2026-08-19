import { RouteGuard } from '@/components/auth/RouteGuard';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={['citizen']}>{children}</RouteGuard>;
}

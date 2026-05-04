// The login page must NOT inherit the admin layout (which redirects to login if unauthenticated).
// This separate layout renders without the sidebar/auth check.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

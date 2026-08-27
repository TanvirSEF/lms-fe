'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogIn, LogOut, UserPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/link-button';
import { useAuth } from '@/components/providers/auth-provider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  let links = navLinks;

  if (user && user.userRole === 'student') {
    links = [...links, { href: '/my-courses', label: 'My Courses' }];
  }

  if (user && user.userRole !== 'student') {
    links = [...links, { href: '/manage', label: 'Manage' }];
  }

  if (user && (user.userRole === 'admin' || user.userRole === 'content_manager')) {
    links = [...links, { href: '/blog/manage', label: 'Blog admin' }];
  }

  if (user && user.userRole === 'admin') {
    links = [...links, { href: '/admin', label: 'Admin' }];
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <GraduationCap className="size-5" />
            LMS
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Badge variant="outline" className="capitalize">
                {user.userRole.replaceAll('_', ' ')}
              </Badge>
              <span className="text-sm text-muted-foreground">{user.username}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Log out"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <LinkButton variant="ghost" size="sm" href="/login">
                <LogIn className="size-4" />
                Login
              </LinkButton>
              <LinkButton size="sm" href="/register">
                <UserPlus className="size-4" />
                Register
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

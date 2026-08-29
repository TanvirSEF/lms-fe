'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap, LogIn, LogOut, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/link-button';
import { useAuth } from '@/components/providers/auth-provider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-medium">
            <GraduationCap className="size-5" />
            LMS
          </Link>
          <nav className="flex items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block">
                {user.username}
              </span>
              <LinkButton href="/dashboard" size="sm" aria-label="Go to app">
                <span className="hidden sm:inline">Go to app</span>
                <ArrowRight className="size-4" />
              </LinkButton>
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
              <LinkButton variant="ghost" size="sm" href="/login" aria-label="Log in">
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </LinkButton>
              <LinkButton size="sm" href="/register" aria-label="Register">
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">Register</span>
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

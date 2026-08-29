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
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <GraduationCap className="size-5" />
            LMS
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block">
                {user.username}
              </span>
              <LinkButton href="/dashboard" size="sm">
                Go to app
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

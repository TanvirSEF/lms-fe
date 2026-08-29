'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PencilLine,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserRole } from '@/lib/api';

type NavItem = {
  href: string;
  label: string;
  icon: typeof BookOpen;
};

const commonItems: NavItem[] = [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];

const roleItems: Record<UserRole, NavItem[]> = {
  student: [
    { href: '/my-courses', label: 'My courses', icon: GraduationCap },
    { href: '/courses', label: 'Browse courses', icon: BookOpen },
  ],
  instructor: [{ href: '/manage', label: 'Manage courses', icon: PencilLine }],
  content_manager: [
    { href: '/manage', label: 'Manage courses', icon: PencilLine },
    { href: '/blog/manage', label: 'Blog admin', icon: ClipboardList },
  ],
  admin: [
    { href: '/manage', label: 'Manage courses', icon: PencilLine },
    { href: '/blog/manage', label: 'Blog admin', icon: ClipboardList },
    { href: '/admin', label: 'Admin panel', icon: ShieldCheck },
  ],
};

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex flex-col gap-2 p-4 text-sm text-muted-foreground">
        <Link href="/login" onClick={onNavigate}>
          Log in
        </Link>
      </div>
    );
  }

  const items = [...commonItems, ...roleItems[user.userRole]];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-5 font-medium">
        <GraduationCap className="size-5" />
        LMS
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-muted font-medium'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="shrink-0 border-t p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {initials(user.username)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.username}</p>
            <Badge variant="outline" className="mt-0.5 h-5 px-1.5 text-[10px] capitalize">
              {user.userRole.replaceAll('_', ' ')}
            </Badge>
          </div>
          <ThemeToggle />
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
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
      <div className="sticky top-0 h-svh">
        <SidebarNav />
      </div>
    </aside>
  );
}

export function AppMobileBar() {
  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
      <Sheet>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <Link href="/dashboard" className="flex items-center gap-2 font-medium">
        <GraduationCap className="size-5" />
        LMS
      </Link>

      <ThemeToggle />
    </div>
  );
}

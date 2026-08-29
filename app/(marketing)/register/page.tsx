import { BrandMark } from '@/components/brand-mark';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-[80svh] flex-col items-center justify-center gap-6 overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <BrandMark title="Create your account" subtitle="New accounts join as students" />
      <RegisterForm />
    </main>
  );
}

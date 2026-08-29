import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  Trophy,
} from "lucide-react"

import { Footer } from "@/components/footer"
import { LinkButton } from "@/components/link-button"
import { getCourses } from "@/lib/courses"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop"

const features = [
  {
    icon: BookOpen,
    title: "Learn in sequence",
    description: "Work through lessons step by step, with text or video content.",
  },
  {
    icon: ClipboardCheck,
    title: "Track your progress",
    description: "Mark lessons complete and watch your percentage grow course by course.",
  },
  {
    icon: Trophy,
    title: "Prove your skills",
    description: "Take MCQ quizzes and get your score instantly, graded on the server.",
  },
]

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Enroll in courses, learn at their own pace and track progress.",
  },
  {
    icon: PenLine,
    title: "Instructors",
    description: "Build their own courses, lessons and quizzes, and follow student progress.",
  },
  {
    icon: BookOpen,
    title: "Content managers",
    description: "Curate every course and publish posts on the platform blog.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    description: "See platform stats and manage user roles from a dedicated panel.",
  },
]

export default async function Home() {
  const courses = await getCourses()
  const lessonCount = courses.reduce((sum, course) => sum + course.lessons.length, 0)

  const stats = [
    { label: "Courses", value: String(courses.length) },
    { label: "Lessons", value: String(lessonCount) },
    { label: "Price", value: "Free" },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <div className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute -top-32 left-1/4 -z-10 size-[420px] rounded-full bg-primary/10 blur-3xl" />

        <section className="mx-auto grid max-w-5xl items-center gap-12 px-4 pb-16 pt-16 sm:pt-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            <span
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
              style={{ animationDelay: "0ms" }}
            >
              <LayoutDashboard className="size-3.5" />
              Built with Next.js, Strapi and PostgreSQL
            </span>

            <h1
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-xl text-4xl font-medium tracking-tight sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              Learn at your <span className="text-primary">own pace</span>
            </h1>

            <p
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-md text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "160ms" }}
            >
              Enroll in courses, track your progress lesson by lesson and prove
              what you have learned with auto-graded quizzes.
            </p>

            <div
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 mt-2 flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <LinkButton size="lg" href="/courses">
                Browse courses
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton size="lg" variant="outline" href="/blog">
                Read the blog
              </LinkButton>
            </div>

            <div
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4 grid w-full max-w-md grid-cols-3 divide-x rounded-lg border bg-background"
              style={{ animationDelay: "320ms" }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1 px-4 py-3">
                  <span className="text-lg font-medium tabular-nums">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="animate-in fade-in zoom-in-95 duration-700 relative hidden lg:block"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Students learning together with laptops"
              className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-foreground/10"
            />
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group animate-in fade-in slide-in-from-bottom-3 duration-700 rounded-xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm"
              style={{ animationDelay: `${120 * index}ms` }}
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h2 className="mt-4 font-medium">{feature.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              One platform, four roles
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every role sees exactly what it is allowed to — enforced on the backend.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <div key={role.title} className="rounded-xl border bg-background p-5">
                <role.icon className="size-5 text-muted-foreground" />
                <h3 className="mt-3 font-medium">{role.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <div className="flex flex-col items-center gap-5 rounded-2xl border bg-muted/30 px-6 py-14 text-center">
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Create a free account, enroll in a course and your progress will be
            waiting for you on every device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton size="lg" href="/register">
              Create account
              <ArrowRight className="size-4" />
            </LinkButton>
            <Link
              href="/courses"
              className="self-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              or browse courses first
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

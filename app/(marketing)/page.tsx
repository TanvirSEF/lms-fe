import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  PenLine,
  PlayCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react"

import { Footer } from "@/components/footer"
import { LinkButton } from "@/components/link-button"
import { getCourses } from "@/lib/courses"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop"

const SPLIT_IMAGE_1 =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80&auto=format&fit=crop"

const SPLIT_IMAGE_2 =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80&auto=format&fit=crop"

const PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop"

const steps = [
  {
    title: "Pick a course",
    description: "Browse the catalog and preview the lesson list before you enroll.",
  },
  {
    title: "Learn lesson by lesson",
    description: "Work through ordered lessons with text or video, at your own pace.",
  },
  {
    title: "Track and prove it",
    description: "Watch your progress grow, then take the quiz and get your score instantly.",
  },
]

const features = [
  "Ordered lessons with text or video content",
  "Progress percentage per course, saved automatically",
  "Auto-graded quizzes with instant results",
  "A personal library of everything you enrolled in",
]

const controls = [
  {
    title: "For students",
    description: "A clean player, a visible progress bar and quizzes that give feedback the moment you submit.",
  },
  {
    title: "For course teams",
    description: "Instructors build their own courses. Content managers curate everything. Admins manage roles.",
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

const testimonials = [
  {
    name: "Ayesha R.",
    role: "Student",
    quote: "The progress bar is surprisingly motivating — I finished a course just to see it hit 100%.",
  },
  {
    name: "Tanvir H.",
    role: "Instructor",
    quote: "Uploading lessons and building quizzes takes minutes. Everything just stays in order.",
  },
  {
    name: "Sadia K.",
    role: "Content manager",
    quote: "Draft, review, publish — the blog and course workflow is exactly how I want it.",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default async function Home() {
  const courses = await getCourses()
  const lessonCount = courses.reduce((sum, course) => sum + course.lessons.length, 0)

  const stats = [
    { label: "Courses", value: String(courses.length) },
    { label: "Lessons", value: String(lessonCount) },
    { label: "Enrollment", value: "Free" },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <div className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute -top-32 left-1/4 -z-10 size-[420px] rounded-full bg-primary/10 blur-3xl" />

        <section className="mx-auto grid max-w-5xl items-center gap-12 px-4 pb-16 pt-16 sm:pt-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            <h1
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-xl text-4xl font-medium tracking-tight sm:text-5xl"
              style={{ animationDelay: "0ms" }}
            >
              Learn at your <span className="text-primary">own pace</span>
            </h1>

            <p
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-md text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "100ms" }}
            >
              Enroll in courses, track your progress lesson by lesson and prove
              what you have learned with auto-graded quizzes.
            </p>

            <div
              className="animate-in fade-in slide-in-from-bottom-3 duration-700 mt-2 flex flex-wrap gap-3"
              style={{ animationDelay: "200ms" }}
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
              style={{ animationDelay: "300ms" }}
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
            style={{ animationDelay: "150ms" }}
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

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-medium tracking-tight">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div
          className="animate-in fade-in slide-in-from-bottom-3 duration-700 order-2 lg:order-1"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Everything a course needs
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <LinkButton href="/courses" variant="outline">
              See what is available
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
        <div
          className="animate-in fade-in zoom-in-95 duration-700 order-1 lg:order-2"
          style={{ animationDelay: "150ms" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPLIT_IMAGE_1}
            alt="Taking notes during a lesson"
            className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-foreground/10"
          />
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <div className="animate-in fade-in zoom-in-95 duration-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SPLIT_IMAGE_2}
              alt="A team working through course material"
              className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-foreground/10"
            />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 flex flex-col gap-6">
            {controls.map((control) => (
              <div key={control.title}>
                <h3 className="font-medium">{control.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {control.description}
                </p>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              Every action is permission-checked on the server, not just hidden from the menu.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            A player that stays out of the way
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lessons, progress and quizzes in one focused screen.
          </p>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="ml-3 rounded-md bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
              lms-fe-nine-ivory.vercel.app
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PREVIEW_IMAGE}
            alt="The course player showing lessons and progress"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <PlayCircle className="size-4" />
            Video lessons
          </span>
          <span className="flex items-center gap-2">
            <ClipboardCheck className="size-4" />
            Auto-graded quizzes
          </span>
          <span className="flex items-center gap-2">
            <Trophy className="size-4" />
            Instant results
          </span>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              One platform, four roles
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every role sees exactly what it is allowed to.
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

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="flex flex-col gap-4 rounded-xl border p-6">
              <blockquote className="text-sm leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {initials(testimonial.name)}
                </span>
                <span>
                  <span className="block text-sm font-medium">{testimonial.name}</span>
                  <span className="block text-xs text-muted-foreground">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
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

import { ArrowRight, BookOpen, ClipboardCheck, Trophy } from "lucide-react"

import { LinkButton } from "@/components/link-button"

const features = [
  {
    icon: BookOpen,
    title: "Learn in sequence",
    description: "Work through course lessons one step at a time.",
  },
  {
    icon: ClipboardCheck,
    title: "Track your progress",
    description: "Mark lessons complete and see how far you have come.",
  },
  {
    icon: Trophy,
    title: "Prove your skills",
    description: "Take quizzes and get your score instantly.",
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="flex flex-col items-start gap-5 py-20">
        <h1 className="max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
          Learn at your own pace
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Enroll in courses, track your progress and test yourself with quizzes.
        </p>
        <div className="flex gap-3">
          <LinkButton size="lg" href="/register">
            Get started
            <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton variant="outline" size="lg" href="/login">
            Log in
          </LinkButton>
        </div>
      </section>

      <section className="grid gap-4 pb-20 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border p-5">
            <feature.icon className="size-5 text-muted-foreground" />
            <h2 className="mt-3 font-medium">{feature.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

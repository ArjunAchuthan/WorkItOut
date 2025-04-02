import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WorkItOut</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                AI-Powered Workouts
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Your Personal <span className="gradient-text">AI Workout</span> Assistant
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Get personalized workout plans based on your goals, experience, and available equipment. Track your
                progress and stay motivated with WorkItOut.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-600 p-1">
                <div className="h-full w-full rounded-xl bg-card p-4">
                  <div className="grid h-full grid-rows-[auto_1fr] gap-4 rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">Today's Workout</div>
                      <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        30 min
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {[
                        { name: "Push-ups", sets: "3 sets × 12 reps" },
                        { name: "Squats", sets: "3 sets × 15 reps" },
                        { name: "Plank", sets: "3 sets × 30 sec" },
                        { name: "Lunges", sets: "3 sets × 10 reps" },
                        { name: "Mountain Climbers", sets: "3 sets × 20 reps" },
                      ].map((exercise, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                        >
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">{exercise.sets}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-border bg-muted/30">
          <div className="container py-20">
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose WorkItOut?</h2>
              <p className="text-muted-foreground">
                Our AI-powered platform creates personalized workout plans tailored to your specific needs and goals.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Personalized Plans",
                  description:
                    "Get workout plans tailored to your experience level, available equipment, and health conditions.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: "AI-Powered",
                  description: "Our intelligent system adapts your workouts based on your progress and feedback.",
                },
                {
                  icon: <BarChart3 className="h-10 w-10 text-primary" />,
                  title: "Progress Tracking",
                  description: "Track your workouts, monitor your progress, and visualize your improvements over time.",
                },
              ].map((feature, i) => (
                <div key={i} className="workout-card">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-t border-border">
          <div className="container py-20">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to transform your fitness journey?</h2>
              <p className="mb-8 text-muted-foreground">
                Join thousands of users who have already improved their fitness with WorkItOut.
              </p>
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">WorkItOut</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WorkItOut. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


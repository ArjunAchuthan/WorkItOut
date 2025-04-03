"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Clock,
  Filter,
  Search,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { WorkoutModal } from "@/components/workout-modal";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setWorkouts(data.workouts);
      } catch (err) {
        setError("Failed to load workouts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Filter workouts based on search query and active tab
  const filterWorkouts = (workouts: any[], tab: string) => {
    return workouts.filter((workout) => {
      const matchesSearch = workout.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab = tab === "all" || workout.type === tab;
      return matchesSearch && matchesTab;
    });
  };

  const handleWorkoutClick = (workout: any) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container flex items-center justify-center py-6">
              <div className="text-center">
                <p>Loading workouts...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container flex items-center justify-center py-6">
              <div className="text-center">
                <p className="text-red-500">{error}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Workouts</h1>
                <p className="text-muted-foreground">
                  Browse and start your personalized workout sessions
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Workout
              </Button>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="strength">Strength</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
                <TabsTrigger value="mobility">Mobility</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "all").map((workout) => (
                    <WorkoutCard
                      key={workout._id}
                      workout={workout}
                      onClick={() => handleWorkoutClick(workout)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="strength" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "strength").map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onClick={() => handleWorkoutClick(workout)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cardio" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "cardio").map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onClick={() => handleWorkoutClick(workout)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mobility" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "mobility").map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onClick={() => handleWorkoutClick(workout)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {selectedWorkout && (
        <WorkoutModal
          open={showWorkoutModal}
          onClose={() => setShowWorkoutModal(false)}
          workout={selectedWorkout}
        />
      )}
    </div>
  );
}

interface WorkoutCardProps {
  workout: any;
  onClick: () => void;
}

function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="workout-card cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-full bg-primary/10 p-2">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{workout.duration}</span>
        </div>
      </div>
      <h3 className="mb-1 text-lg font-bold">{workout.name}</h3>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {workout.type}
        </span>
        {workout.difficulty && (
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
            {workout.difficulty}
          </span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {workout.exercises?.length} exercises
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-primary">
        View workout <ChevronRight className="ml-1 h-4 w-4" />
      </div>
    </motion.div>
  );
}

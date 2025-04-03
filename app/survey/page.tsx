"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Survey steps
const steps = [
  "Basic Information",
  "Experience Level",
  "Activity Level",
  "Workout Duration",
  "Health Conditions",
  "Workout Environment",
  "Fitness Goal",
  "Equipment",
  "Confirmation",
];

export default function Survey() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Survey form data
  const [formData, setFormData] = useState({
    email: "", // Add email to formData
    weight: "",
    height: "",
    age: "",
    gender: "",

    // Experience Level
    experienceLevel: "",

    // Activity Level
    activityLevel: "",

    // Workout Duration
    workoutDuration: "",

    // Health Conditions
    healthConditions: [] as string[],

    // Workout Environment
    workoutEnvironment: "",

    // Fitness Goal
    fitnessGoal: "",

    // Equipment (only shown if workoutEnvironment is "home" or "both")
    equipment: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[];

      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection("forward");

      // Skip Equipment step if Gym is selected
      if (currentStep === 6 && formData.workoutEnvironment === "gym") {
        setCurrentStep(8); // Skip to Confirmation
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection("backward");

      // Skip Equipment step if Gym is selected when going back
      if (currentStep === 8 && formData.workoutEnvironment === "gym") {
        setCurrentStep(6); // Go back to Fitness Goal
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to save the survey data
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail, // Include the email in the survey submission
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          gender: formData.gender,

          // Experience Level
          experienceLevel: formData.experienceLevel,

          // Activity Level
          activityLevel: formData.activityLevel,

          // Workout Duration
          workoutDuration: formData.workoutDuration,

          // Health Conditions
          healthConditions: formData.healthConditions,

          // Workout Environment
          workoutEnvironment: formData.workoutEnvironment,

          // Fitness Goal
          fitnessGoal: formData.fitnessGoal,

          // Equipment (only shown if workoutEnvironment is "home" or "both")
          equipment: formData.equipment,
        }),
      });

      if (!response.ok) {
        throw new Error("Survey Success");
      }
      toast({
        title: "Survey completed!",
        description: "Your personalized workout plan is ready.",
      });

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error saving your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: string) => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WorkItOut</span>
          </div>
          <div className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Getting Started</span>
              <span>Complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                <div className="survey-card">
                  {/* Step 1: Basic Information */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          Basic Information
                        </h2>
                        <p className="text-muted-foreground">
                          Let's start with some basic information about you.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="70"
                            value={formData.weight}
                            onChange={(e) =>
                              updateFormData("weight", e.target.value)
                            }
                            className="survey-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            placeholder="175"
                            value={formData.height}
                            onChange={(e) =>
                              updateFormData("height", e.target.value)
                            }
                            className="survey-input"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="30"
                            value={formData.age}
                            onChange={(e) =>
                              updateFormData("age", e.target.value)
                            }
                            className="survey-input"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) =>
                              updateFormData("gender", value)
                            }
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Experience Level */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Experience Level</h2>
                        <p className="text-muted-foreground">
                          Tell us about your fitness experience.
                        </p>
                      </div>

                      <RadioGroup
                        value={formData.experienceLevel}
                        onValueChange={(value) =>
                          updateFormData("experienceLevel", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="beginner"
                            id="beginner"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="beginner"
                              className="text-base font-medium"
                            >
                              Beginner
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              New to fitness or returning after a long break.
                              Little to no experience with structured workouts.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="intermediate"
                            id="intermediate"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="intermediate"
                              className="text-base font-medium"
                            >
                              Intermediate
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Consistent with workouts for 6+ months. Familiar
                              with proper form and various exercises.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="advanced"
                            id="advanced"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="advanced"
                              className="text-base font-medium"
                            >
                              Advanced
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Experienced with structured training for 2+ years.
                              Looking for challenging, specialized programs.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 3: Activity Level */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          Daily Activity Level
                        </h2>
                        <p className="text-muted-foreground">
                          How active are you in your daily life, outside of
                          planned workouts?
                        </p>
                      </div>

                      <RadioGroup
                        value={formData.activityLevel}
                        onValueChange={(value) =>
                          updateFormData("activityLevel", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="sedentary"
                            id="sedentary"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="sedentary"
                              className="text-base font-medium"
                            >
                              Sedentary
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Mostly sitting throughout the day with little
                              physical activity.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="lightly-active"
                            id="lightly-active"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="lightly-active"
                              className="text-base font-medium"
                            >
                              Lightly Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Light activity like walking 1-3 days per week or
                              standing for parts of the day.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="moderately-active"
                            id="moderately-active"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="moderately-active"
                              className="text-base font-medium"
                            >
                              Moderately Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Moderate activity like walking 3-5 days per week
                              or active job with regular movement.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="highly-active"
                            id="highly-active"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="highly-active"
                              className="text-base font-medium"
                            >
                              Highly Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Physically demanding job or lifestyle with
                              frequent intense movement throughout the day.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 4: Workout Duration */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          Preferred Workout Duration
                        </h2>
                        <p className="text-muted-foreground">
                          How much time can you dedicate to each workout
                          session?
                        </p>
                      </div>

                      <RadioGroup
                        value={formData.workoutDuration}
                        onValueChange={(value) =>
                          updateFormData("workoutDuration", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="15"
                            id="duration-15"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="duration-15"
                              className="text-base font-medium"
                            >
                              15 minutes
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Quick, high-intensity workouts for busy schedules.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="30"
                            id="duration-30"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="duration-30"
                              className="text-base font-medium"
                            >
                              30 minutes
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Balanced workouts with moderate intensity and
                              variety.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="60"
                            id="duration-60"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="duration-60"
                              className="text-base font-medium"
                            >
                              60 minutes
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Comprehensive workouts with warm-up, main
                              exercises, and cool-down.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="75"
                            id="duration-75"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="duration-75"
                              className="text-base font-medium"
                            >
                              75 minutes
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Extended workouts for maximum results with
                              detailed focus on technique and form.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 5: Health Conditions */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          Health Conditions
                        </h2>
                        <p className="text-muted-foreground">
                          Select any health conditions or injuries that might
                          affect your workouts.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: "back-pain", label: "Back Pain" },
                          { id: "knee-issues", label: "Knee Issues" },
                          { id: "shoulder-pain", label: "Shoulder Pain" },
                          {
                            id: "high-blood-pressure",
                            label: "High Blood Pressure",
                          },
                          { id: "joint-issues", label: "Joint Issues" },
                          { id: "heart-condition", label: "Heart Condition" },
                        ].map((condition) => (
                          <div
                            key={condition.id}
                            className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50"
                          >
                            <Checkbox
                              id={condition.id}
                              checked={formData.healthConditions.includes(
                                condition.id
                              )}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "healthConditions",
                                  condition.id,
                                  checked as boolean
                                )
                              }
                              className="mt-1"
                            />
                            <div>
                              <Label
                                htmlFor={condition.id}
                                className="text-base font-medium"
                              >
                                {condition.label}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 6: Workout Environment */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          Workout Environment
                        </h2>
                        <p className="text-muted-foreground">
                          Where do you plan to do most of your workouts?
                        </p>
                      </div>

                      <RadioGroup
                        value={formData.workoutEnvironment}
                        onValueChange={(value) =>
                          updateFormData("workoutEnvironment", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="gym"
                            id="gym"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="gym"
                              className="text-base font-medium"
                            >
                              Gym
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Access to a full range of equipment including
                              machines, free weights, and cardio equipment.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="home"
                            id="home"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="home"
                              className="text-base font-medium"
                            >
                              Home Workout
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Limited equipment at home or prefer bodyweight
                              exercises.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="both"
                            id="both"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="both"
                              className="text-base font-medium"
                            >
                              Both
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Mix of gym and home workouts depending on schedule
                              and availability.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 6: Fitness Goal */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Fitness Goal</h2>
                        <p className="text-muted-foreground">
                          What is your primary fitness goal?
                        </p>
                      </div>

                      <RadioGroup
                        value={formData.fitnessGoal}
                        onValueChange={(value) =>
                          updateFormData("fitnessGoal", value)
                        }
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="fat-loss"
                            id="fat-loss"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="fat-loss"
                              className="text-base font-medium"
                            >
                              Fat Loss
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Focus on burning calories and reducing body fat
                              percentage.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="muscle-gain"
                            id="muscle-gain"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="muscle-gain"
                              className="text-base font-medium"
                            >
                              Muscle Gain
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Focus on building muscle mass and strength.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="general-fitness"
                            id="general-fitness"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="general-fitness"
                              className="text-base font-medium"
                            >
                              General Fitness
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Focus on overall health, endurance, and
                              well-being.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50">
                          <RadioGroupItem
                            value="strength-performance"
                            id="strength-performance"
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor="strength-performance"
                              className="text-base font-medium"
                            >
                              Strength & Performance
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Focus on athletic performance, power, and
                              functional strength.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 7: Equipment (only if home workout or both) */}
                  {currentStep === 7 &&
                    (formData.workoutEnvironment === "home" ||
                      formData.workoutEnvironment === "both") && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold">
                            Available Equipment
                          </h2>
                          <p className="text-muted-foreground">
                            Select the equipment you have access to for your
                            workouts.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {[
                            { id: "dumbbells", label: "Dumbbells" },
                            {
                              id: "resistance-bands",
                              label: "Resistance Bands",
                            },
                            { id: "kettlebells", label: "Kettlebells" },
                            { id: "pull-up-bar", label: "Pull-up Bar" },
                            { id: "bench", label: "Workout Bench" },
                            { id: "yoga-mat", label: "Yoga Mat" },
                            {
                              id: "none",
                              label: "No Equipment (Bodyweight Only)",
                            },
                          ].map((equipment) => (
                            <div
                              key={equipment.id}
                              className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:border-primary/50"
                            >
                              <Checkbox
                                id={equipment.id}
                                checked={formData.equipment.includes(
                                  equipment.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(
                                    "equipment",
                                    equipment.id,
                                    checked as boolean
                                  )
                                }
                                className="mt-1"
                              />
                              <div>
                                <Label
                                  htmlFor={equipment.id}
                                  className="text-base font-medium"
                                >
                                  {equipment.label}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Step 8: Confirmation */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Almost Done!</h2>
                        <p className="text-muted-foreground">
                          Review your information and submit to get your
                          personalized workout plan.
                        </p>
                      </div>

                      <div className="space-y-4 rounded-lg border border-border p-4">
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Basic Information
                            </p>
                            <p>Weight: {formData.weight} kg</p>
                            <p>Height: {formData.height} cm</p>
                            <p>Age: {formData.age}</p>
                            <p>Gender: {formData.gender}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Fitness Profile
                            </p>
                            <p>Experience: {formData.experienceLevel}</p>
                            <p>Activity Level: {formData.activityLevel}</p>
                            <p>
                              Workout Duration: {formData.workoutDuration}{" "}
                              minutes
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Health Conditions
                          </p>
                          <p>
                            {formData.healthConditions.length > 0
                              ? formData.healthConditions.join(", ")
                              : "None"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Workout Environment
                          </p>
                          <p>{formData.workoutEnvironment}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Fitness Goal
                          </p>
                          <p>{formData.fitnessGoal}</p>
                        </div>

                        {(formData.workoutEnvironment === "home" ||
                          formData.workoutEnvironment === "both") && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Available Equipment
                            </p>
                            <p>
                              {formData.equipment.length > 0
                                ? formData.equipment.join(", ")
                                : "None"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="text-sm">
                          By submitting, you agree that we'll use this
                          information to create your personalized workout plan.
                          We take your privacy seriously and will never share
                          your information with third parties.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0 || isLoading}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        {isLoading ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit <Check className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

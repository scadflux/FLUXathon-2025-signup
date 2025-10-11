import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(100),
  member1FirstName: z.string().min(2, "First name required").max(50),
  member1LastName: z.string().min(2, "Last name required").max(50),
  member1Email: z.string().email("Invalid email address"),
  member2FirstName: z.string().min(2, "First name required").max(50),
  member2LastName: z.string().min(2, "Last name required").max(50),
  member2Email: z.string().email("Invalid email address"),
  member3FirstName: z.string().min(2, "First name required").max(50),
  member3LastName: z.string().min(2, "Last name required").max(50),
  member3Email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

const MAX_SUBMISSIONS = 20;
const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

export default function TeamSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isCapacityReached, setIsCapacityReached] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkCapacity = async () => {
    if (!WEBHOOK_URL) return true;

    try {
      const formData = new URLSearchParams();
      formData.append("action", "checkCount");

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const count = data.count || 0;
        setSubmissionCount(count);

        if (count >= MAX_SUBMISSIONS) {
          setIsCapacityReached(true);
        }

        return count < MAX_SUBMISSIONS;
      }
    } catch (error) {
      console.error("Error checking capacity:", error);
    }
    return true;
  };

  // Load current submission count on component mount
  useEffect(() => {
    const loadCount = async () => {
      await checkCapacity();
      setIsLoading(false);
    };
    loadCount();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!WEBHOOK_URL) {
      toast.error("Google Sheets webhook URL is not configured");
      return;
    }

    setIsSubmitting(true);

    try {
      const hasCapacity = await checkCapacity();

      if (!hasCapacity) {
        setIsCapacityReached(true);
        toast.error("Submission capacity has been reached (20/20)");
        setIsSubmitting(false);
        return;
      }

      const formData = new URLSearchParams();
      formData.append("action", "submit");
      formData.append("teamName", data.teamName);
      formData.append("member1FirstName", data.member1FirstName);
      formData.append("member1LastName", data.member1LastName);
      formData.append("member1Email", data.member1Email);
      formData.append("member2FirstName", data.member2FirstName);
      formData.append("member2LastName", data.member2LastName);
      formData.append("member2Email", data.member2Email);
      formData.append("member3FirstName", data.member3FirstName);
      formData.append("member3LastName", data.member3LastName);
      formData.append("member3Email", data.member3Email);
      formData.append("timestamp", new Date().toISOString());

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setSubmissionCount((prev) => prev + 1);
        toast.success("Team successfully registered!");
        reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full p-8 text-center space-y-4 bg-card border-border">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Successfully Registered!</h2>
          <p className="text-muted-foreground">
            Your team has been registered for the design competition. Good luck!
          </p>
          <Button onClick={() => setIsSubmitted(false)} className="mt-4">
            Submit Another Team
          </Button>
        </Card>
      </div>
    );
  }

  if (isCapacityReached) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full p-8 text-center space-y-4 bg-card border-border">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Capacity Reached</h2>
          <p className="text-muted-foreground">
            We've reached the maximum of {MAX_SUBMISSIONS} team submissions for this competition.
            Thank you for your interest!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Design Competition
          </h1>
          <p className="text-muted-foreground">Team Registration Form</p>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {submissionCount}/{MAX_SUBMISSIONS} teams registered
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="p-6 space-y-4 bg-card border-border">
              <h3 className="text-xl font-semibold text-foreground">Team Information</h3>
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-foreground">Team Name</Label>
                <Input
                  id="teamName"
                  {...register("teamName")}
                  className="bg-input border-border text-foreground"
                  placeholder="Enter your team name"
                />
                {errors.teamName && (
                  <p className="text-sm text-destructive">{errors.teamName.message}</p>
                )}
              </div>
            </Card>

            {[1, 2, 3].map((num) => (
              <Card key={num} className="p-6 space-y-4 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground">Team Member {num}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`member${num}FirstName`} className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id={`member${num}FirstName`}
                      {...register(`member${num}FirstName` as keyof FormData)}
                      className="bg-input border-border text-foreground"
                      placeholder="First name"
                    />
                    {errors[`member${num}FirstName` as keyof FormData] && (
                      <p className="text-sm text-destructive">
                        {errors[`member${num}FirstName` as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`member${num}LastName`} className="text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id={`member${num}LastName`}
                      {...register(`member${num}LastName` as keyof FormData)}
                      className="bg-input border-border text-foreground"
                      placeholder="Last name"
                    />
                    {errors[`member${num}LastName` as keyof FormData] && (
                      <p className="text-sm text-destructive">
                        {errors[`member${num}LastName` as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`member${num}Email`} className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id={`member${num}Email`}
                      type="email"
                      {...register(`member${num}Email` as keyof FormData)}
                      className="bg-input border-border text-foreground"
                      placeholder="email@example.com"
                    />
                    {errors[`member${num}Email` as keyof FormData] && (
                      <p className="text-sm text-destructive">
                        {errors[`member${num}Email` as keyof FormData]?.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Team Registration"
              )}
            </Button>
        </form>
      </div>
    </div>
  );
}

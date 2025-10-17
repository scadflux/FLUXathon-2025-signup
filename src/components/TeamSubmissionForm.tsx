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
  member1Email: z.string().email("Invalid email address").refine(
    (email) => email.endsWith("@student.scad.edu"),
    { message: "Email must be a @student.scad.edu address" }
  ),
  member2FirstName: z.string().min(2, "First name required").max(50),
  member2LastName: z.string().min(2, "Last name required").max(50),
  member2Email: z.string().email("Invalid email address").refine(
    (email) => email.endsWith("@student.scad.edu"),
    { message: "Email must be a @student.scad.edu address" }
  ),
  member3FirstName: z.string().min(2, "First name required").max(50),
  member3LastName: z.string().min(2, "Last name required").max(50),
  member3Email: z.string().email("Invalid email address").refine(
    (email) => email.endsWith("@student.scad.edu"),
    { message: "Email must be a @student.scad.edu address" }
  ),
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
          return false;
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

  // Poll for capacity every 5 seconds while form is active
  useEffect(() => {
    if (isSubmitted || isCapacityReached || isLoading) {
      return;
    }

    const intervalId = setInterval(() => {
      checkCapacity();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isSubmitted, isCapacityReached, isLoading]);

  const onSubmit = async (data: FormData) => {
    if (!WEBHOOK_URL) {
      toast.error("Google Sheets webhook URL is not configured");
      return;
    }

    setIsSubmitting(true);

    try {
      // Client-side capacity check before submission
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
        const result = await response.json();

        // Server-side capacity check - handle race condition rejections
        if (result.error === "CAPACITY_REACHED") {
          setIsCapacityReached(true);
          toast.error("Registration closed - maximum capacity reached during submission");
          setIsSubmitting(false);
          // Refresh the count to show accurate status
          await checkCapacity();
          return;
        }

        setIsSubmitted(true);
        setSubmissionCount((prev) => prev + 1);
        toast.success("Team successfully registered!");
        reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === "CAPACITY_REACHED") {
          setIsCapacityReached(true);
          toast.error("Registration closed - maximum capacity reached during submission");
          await checkCapacity();
        } else {
          throw new Error("Submission failed");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared background component
  const backgroundShapes = (
    <div className="absolute inset-0">
          {/* Large shapes */}
          <div className="absolute -top-32 -left-32 w-[55vw] h-[55vw] md:w-[22vw] md:h-[22vw] bg-blue-400/15 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
          <div className="absolute top-1/4 right-0 w-[70vw] h-[70vw] md:w-[30vw] md:h-[30vw] bg-blue-500/10 rounded-full animate-float-reverse" style={{'--float-x': '-2vw', '--float-y': '1.8vw'} as React.CSSProperties}></div>
          <div className="absolute -bottom-48 left-1/3 w-[60vw] h-[60vw] md:w-[25vw] md:h-[25vw] bg-blue-600/12 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '-1vw'} as React.CSSProperties}></div>
          <div className="absolute top-1/2 right-1/4 w-[58vw] h-[58vw] md:w-[24vw] md:h-[24vw] bg-blue-300/14 rounded-full animate-float-reverse" style={{'--float-x': '-1.8vw', '--float-y': '-1.5vw'} as React.CSSProperties}></div>
          <div className="absolute top-[5%] right-[45%] w-[65vw] h-[65vw] md:w-[28vw] md:h-[28vw] bg-blue-400/11 rounded-full animate-float-slow" style={{'--float-x': '1.6vw', '--float-y': '1.4vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[10%] right-[8%] w-[62vw] h-[62vw] md:w-[26vw] md:h-[26vw] bg-blue-600/13 rounded-full animate-float-reverse" style={{'--float-x': '-1.7vw', '--float-y': '-1.3vw'} as React.CSSProperties}></div>
          <div className="absolute top-[18%] left-[48%] w-[63vw] h-[63vw] md:w-[27vw] md:h-[27vw] bg-blue-500/12 rounded-full animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.6vw'} as React.CSSProperties}></div>

          {/* Medium squares and rectangles */}
          <div className="absolute top-20 left-1/4 w-[38vw] h-[38vw] md:w-[15vw] md:h-[15vw] bg-blue-300/18 rotate-12 animate-float-reverse" style={{'--float-x': '-1.5vw', '--float-y': '1.2vw', '--rotate-start': '12deg', '--rotate-end': '24deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-32 right-1/4 w-[45vw] h-[28vw] md:w-[19vw] md:h-[11vw] bg-blue-500/15 -rotate-6 animate-float-slow" style={{'--float-x': '1.8vw', '--float-y': '-1.5vw', '--rotate-start': '-6deg', '--rotate-end': '8deg'} as React.CSSProperties}></div>
          <div className="absolute top-1/3 right-1/3 w-[32vw] h-[32vw] md:w-[13vw] md:h-[13vw] bg-blue-400/20 rotate-45 animate-float-reverse" style={{'--float-x': '-1.2vw', '--float-y': '1.6vw', '--rotate-start': '45deg', '--rotate-end': '60deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-1/4 left-10 w-[40vw] h-[26vw] md:w-[16vw] md:h-[10.5vw] bg-blue-600/16 rotate-[20deg] animate-float-slow" style={{'--float-x': '1.4vw', '--float-y': '1.5vw', '--rotate-start': '20deg', '--rotate-end': '35deg'} as React.CSSProperties}></div>
          <div className="absolute top-[15%] right-[15%] w-[35vw] h-[35vw] md:w-[14vw] md:h-[14vw] bg-blue-500/17 animate-float-reverse" style={{'--float-x': '-1.6vw', '--float-y': '1.4vw'} as React.CSSProperties}></div>
          <div className="absolute top-[65%] left-[20%] w-[30vw] h-[42vw] md:w-[12vw] md:h-[17vw] bg-blue-400/14 rotate-[15deg] animate-float-slow" style={{'--float-x': '1.4vw', '--float-y': '-1.3vw', '--rotate-start': '15deg', '--rotate-end': '28deg'} as React.CSSProperties}></div>
          <div className="absolute top-[45%] left-[5%] w-[42vw] h-[32vw] md:w-[17vw] md:h-[13vw] bg-blue-300/16 -rotate-[10deg] animate-float-reverse" style={{'--float-x': '-1.5vw', '--float-y': '1.4vw', '--rotate-start': '-10deg', '--rotate-end': '5deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-[40%] right-[5%] w-[35vw] h-[44vw] md:w-[14vw] md:h-[18vw] bg-blue-500/14 rotate-[28deg] animate-float-slow" style={{'--float-x': '1.6vw', '--float-y': '-1.4vw', '--rotate-start': '28deg', '--rotate-end': '42deg'} as React.CSSProperties}></div>
          <div className="absolute top-[35%] right-[50%] w-[40vw] h-[40vw] md:w-[16vw] md:h-[16vw] bg-blue-600/15 rotate-[8deg] animate-float-reverse" style={{'--float-x': '-1.3vw', '--float-y': '1.5vw', '--rotate-start': '8deg', '--rotate-end': '22deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-[55%] left-[45%] w-[44vw] h-[30vw] md:w-[18vw] md:h-[12vw] bg-blue-400/13 -rotate-[18deg] animate-float-slow" style={{'--float-x': '1.5vw', '--float-y': '1.3vw', '--rotate-start': '-18deg', '--rotate-end': '-4deg'} as React.CSSProperties}></div>
          <div className="absolute top-[52%] left-[72%] w-[38vw] h-[35vw] md:w-[15vw] md:h-[14vw] bg-blue-500/16 rotate-[32deg] animate-float-reverse" style={{'--float-x': '-1.4vw', '--float-y': '1.6vw', '--rotate-start': '32deg', '--rotate-end': '18deg'} as React.CSSProperties}></div>

          {/* Small shapes */}
          <div className="absolute top-40 right-20 w-[12vw] h-[12vw] md:w-[4vw] md:h-[4vw] bg-blue-300/25 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-20 left-20 w-[10vw] h-[16vw] md:w-[3vw] md:h-[6vw] bg-blue-600/20 rotate-12 animate-float-reverse" style={{'--float-x': '-0.8vw', '--float-y': '-0.9vw', '--rotate-start': '12deg', '--rotate-end': '-6deg'} as React.CSSProperties}></div>
          <div className="absolute top-1/2 left-10 w-[14vw] h-[14vw] md:w-[5vw] md:h-[5vw] bg-blue-500/22 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
          <div className="absolute top-2/3 right-10 w-[20vw] h-[20vw] md:w-[7.5vw] md:h-[7.5vw] bg-blue-400/18 rounded-full animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '1.5vw'} as React.CSSProperties}></div>
          <div className="absolute top-[10%] left-[40%] w-[13vw] h-[13vw] md:w-[4.5vw] md:h-[4.5vw] bg-blue-300/21 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[30%] right-[35%] w-[11vw] h-[18vw] md:w-[3.5vw] md:h-[7vw] bg-blue-600/19 rotate-[25deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '1.1vw', '--rotate-start': '25deg', '--rotate-end': '12deg'} as React.CSSProperties}></div>
          <div className="absolute top-[25%] left-[60%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-500/16 rounded-full animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[15%] left-[55%] w-[15vw] h-[10vw] md:w-[5.5vw] md:h-[3.5vw] bg-blue-400/20 animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
          <div className="absolute top-[8%] left-[15%] w-[18vw] h-[18vw] md:w-[6.5vw] md:h-[6.5vw] bg-blue-300/23 rounded-full animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[8%] right-[22%] w-[12vw] h-[20vw] md:w-[4vw] md:h-[7.5vw] bg-blue-600/21 rotate-[16deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '-1.1vw', '--rotate-start': '16deg', '--rotate-end': '4deg'} as React.CSSProperties}></div>
          <div className="absolute top-[50%] right-[12%] w-[15vw] h-[15vw] md:w-[5.5vw] md:h-[5.5vw] bg-blue-500/20 animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '-1.1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[48%] left-[8%] w-[18vw] h-[12vw] md:w-[7vw] md:h-[4vw] bg-blue-400/19 rotate-[10deg] animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '1.2vw', '--rotate-start': '10deg', '--rotate-end': '-5deg'} as React.CSSProperties}></div>
          <div className="absolute top-[60%] right-[58%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-600/18 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[62%] left-[68%] w-[14vw] h-[20vw] md:w-[5vw] md:h-[8vw] bg-blue-300/17 -rotate-[8deg] animate-float-reverse" style={{'--float-x': '-1.2vw', '--float-y': '-1vw', '--rotate-start': '-8deg', '--rotate-end': '6deg'} as React.CSSProperties}></div>
          <div className="absolute top-[72%] left-[35%] w-[13vw] h-[13vw] md:w-[4.5vw] md:h-[4.5vw] bg-blue-500/22 animate-float-slow" style={{'--float-x': '1.1vw', '--float-y': '-1.2vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[75%] right-[42%] w-[11vw] h-[16vw] md:w-[3.5vw] md:h-[6vw] bg-blue-400/20 rotate-[22deg] animate-float-reverse" style={{'--float-x': '-0.9vw', '--float-y': '1.1vw', '--rotate-start': '22deg', '--rotate-end': '10deg'} as React.CSSProperties}></div>
          <div className="absolute top-[38%] left-[82%] w-[14vw] h-[14vw] md:w-[5vw] md:h-[5vw] bg-blue-600/21 rounded-full animate-float-slow" style={{'--float-x': '1vw', '--float-y': '1.2vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[42%] right-[68%] w-[13vw] h-[18vw] md:w-[4.5vw] md:h-[7vw] bg-blue-500/19 rotate-[14deg] animate-float-reverse" style={{'--float-x': '-1.1vw', '--float-y': '-1vw', '--rotate-start': '14deg', '--rotate-end': '2deg'} as React.CSSProperties}></div>
          <div className="absolute top-[82%] right-[28%] w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] bg-blue-400/18 animate-float-slow" style={{'--float-x': '1.2vw', '--float-y': '-1.1vw'} as React.CSSProperties}></div>
          <div className="absolute bottom-[88%] left-[58%] w-[14vw] h-[10vw] md:w-[5vw] md:h-[3vw] bg-blue-300/22 rotate-[20deg] animate-float-reverse" style={{'--float-x': '-1vw', '--float-y': '1.2vw', '--rotate-start': '20deg', '--rotate-end': '8deg'} as React.CSSProperties}></div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#1e3a8a] to-[#1e293b]">
        {backgroundShapes}
        <Card className="max-w-md w-full p-6 sm:p-8 text-center space-y-4 bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
          <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Successfully Registered!</h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Your team submission has been recorded for FLUXathon. Please do not resubmit or have team members submit separately. Good luck!
          </p>
        </Card>
      </div>
    );
  }

  if (isCapacityReached) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#1e3a8a] to-[#1e293b]">
        {backgroundShapes}
        <Card className="max-w-md w-full p-6 sm:p-8 text-center space-y-4 bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Capacity Reached</h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            We've reached the maximum of {MAX_SUBMISSIONS} team submissions for FLUXathon.
            Thank you for your interest!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#1e3a8a] to-[#1e293b]">
      {backgroundShapes}

      <div className="max-w-3xl w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-3 sm:space-y-4">
          <img
            src="/fluxathon.png"
            alt="FLUXathon"
            className="h-24 sm:h-32 mx-auto mb-4 sm:mb-8"
          />
          {isLoading ? (
            <div className="space-y-4 py-8 sm:py-10">
              {/* Loading skeleton */}
              <div className="grid grid-cols-10 gap-2 justify-items-center max-w-md mx-auto">
                {Array.from({ length: MAX_SUBMISSIONS }).map((_, i) => {
                  const row = Math.floor(i / 10);
                  const col = i % 10;
                  const diagonalDelay = (row + col) * 80;
                  return (
                    <div
                      key={`skeleton-${i}`}
                      className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full border-2 border-white/20 animate-loading-wave"
                      style={{ animationDelay: `${diagonalDelay}ms` }}
                    />
                  );
                })}
              </div>
              <div className="text-center min-h-[3rem] flex items-center justify-center">
                <p className="text-sm text-white/50">Loading team slots...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-8 sm:py-10">
              {/* Dot matrix */}
              <div className="grid grid-cols-10 gap-2 justify-items-center max-w-md mx-auto">
                {Array.from({ length: MAX_SUBMISSIONS }).map((_, i) => {
                  const isFilled = i < submissionCount;
                  return (
                    <div
                      key={`dot-${i}`}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-300 ${
                        isFilled ? 'animate-blink-in' : ''
                      }`}
                      style={isFilled ? { animationDelay: `${i * 80}ms` } : undefined}
                    >
                      <div
                        className={`w-full h-full rounded-full border-2 ${
                          isFilled
                            ? 'bg-white border-white shadow-lg shadow-white/30 animate-pulse-dot'
                            : 'bg-white/5 border-white/20 backdrop-blur-sm'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Count */}
              <div className="text-center min-h-[3rem] flex items-center justify-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {submissionCount} / {MAX_SUBMISSIONS} <span className="text-lg sm:text-xl text-white/70 font-normal">teams registered</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-left -mt-2">
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Join FLUX and Google for a one-of-a-kind hackathon fusing creativity and code through an exclusive vibe coding workshop carried into a design sprint. Teams of three are required during sign-up, and only the first 20 will get to compete.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Team Information</h3>
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-foreground">Team Name</Label>
                <Input
                  id="teamName"
                  {...register("teamName")}
                  placeholder="Enter your team name"
                  autoComplete="organization"
                />
                {errors.teamName && (
                  <p className="text-sm text-destructive">{errors.teamName.message}</p>
                )}
              </div>
            </Card>

            {[1, 2, 3].map((num) => (
              <Card key={num} className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Team Member {num}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`member${num}FirstName`} className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id={`member${num}FirstName`}
                      {...register(`member${num}FirstName` as keyof FormData)}
                      placeholder="First name"
                      autoComplete="given-name"
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
                      placeholder="Last name"
                      autoComplete="family-name"
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
                      placeholder="email@student.scad.edu"
                      autoComplete="email"
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300"
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

            <p className="text-center text-xs text-white/20 mt-4">
              <a
                href="https://www.scad.edu/about/scad-glance/disclosures-and-policies/consumer-disclosures"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
        </form>
      </div>
    </div>
  );
}

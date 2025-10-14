import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSubmissionForm from "@/components/TeamSubmissionForm";
import { hasLaunched } from "@/lib/launchTime";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const launched = hasLaunched();

  useEffect(() => {
    // Redirect to countdown if not launched
    if (!launched) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [launched, navigate]);

  if (!launched) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#1e3a8a] to-[#1e293b]">
        <Card className="max-w-md w-full p-6 sm:p-8 text-center space-y-4 bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Registration Not Open</h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Team registration has not opened yet. Please wait for the countdown to complete.
          </p>
          <p className="text-xs text-white/60">
            Redirecting to countdown page...
          </p>
        </Card>
      </div>
    );
  }

  return <TeamSubmissionForm />;
};

export default Index;

import { Button } from "@/components/ui/button";
import { AlertCircle, Phone, Clock, MapPin, ArrowLeft, RefreshCw } from "lucide-react";

interface RecommendationCardProps {
  recommendation: {
    urgency: "gp" | "nurse" | "ed";
    reason: string;
    nextSteps: string[];
  };
  onBack: () => void;
  onNewCheck: () => void;
}

const RecommendationCard = ({ recommendation, onBack, onNewCheck }: RecommendationCardProps) => {
  const getUrgencyConfig = () => {
    switch (recommendation.urgency) {
      case "ed":
        return {
          title: "Go to Emergency Department",
          icon: AlertCircle,
          color: "accent",
          bgColor: "bg-accent/10",
          borderColor: "border-accent/30",
          description: "Your symptoms suggest you should seek immediate medical attention.",
        };
      case "nurse":
        return {
          title: "Call Nurse Helpline",
          icon: Phone,
          color: "warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          description: "We recommend speaking with a healthcare professional soon.",
        };
      case "gp":
        return {
          title: "See Your GP",
          icon: Clock,
          color: "success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          description: "Your symptoms can be addressed by your general practitioner.",
        };
    }
  };

  const config = getUrgencyConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <span className="font-semibold text-foreground">Your Recommendation</span>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-6">
          {/* Main Recommendation Card */}
          <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-3xl p-8 shadow-medium`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-${config.color}/20 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-8 h-8 text-${config.color}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-2">{config.title}</h2>
                <p className="text-lg text-muted-foreground">{config.description}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-card/50 rounded-xl p-6 mb-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Why this recommendation?</h3>
              <p className="text-muted-foreground">{recommendation.reason}</p>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                What to do next:
              </h3>
              <ul className="space-y-3">
                {recommendation.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onNewCheck}
              variant="outline"
              size="lg"
              className="flex-1 border-border hover:bg-muted"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Different Symptoms
            </Button>
            <Button onClick={onBack} size="lg" className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground">
              Return to Home
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important reminder:</strong> This guidance is based on the symptoms
              you described and should not replace professional medical judgment. If your condition worsens or you feel
              unsure at any time, seek immediate medical attention. In a life-threatening emergency, call emergency
              services right away.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationCard;

import { Button } from "@/components/ui/button";
import { Activity, Clock, Shield, Heart } from "lucide-react";

interface HeroProps {
  onStartCheck: () => void;
}

const Hero = ({ onStartCheck }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">GP or ED?</h1>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted Healthcare Guidance</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Not sure where to go
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">when you're unwell?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get trusted, evidence-based advice in minutes. Know whether to see your GP, call a nurse line, or visit
              the Emergency Department.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onStartCheck}
              className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-medium transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              <Activity className="w-5 h-5 mr-2" />
              Check Your Symptoms
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Fast Decisions</h3>
              <p className="text-sm text-muted-foreground">
                Get clear guidance in under 3 minutes, helping you act quickly and confidently.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
              <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Evidence-Based</h3>
              <p className="text-sm text-muted-foreground">
                Powered by clinical decision pathways from trusted health organizations.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Peace of Mind</h3>
              <p className="text-sm text-muted-foreground">
                No more late-night Google searches. Get reassurance from a trusted source.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full px-6 py-6 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Important:</strong> This tool provides guidance only and is not a
            replacement for professional medical advice. In an emergency, always call emergency services immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;

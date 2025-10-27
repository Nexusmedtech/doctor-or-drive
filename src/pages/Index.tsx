import { useState } from "react";
import Hero from "@/components/Hero";
import SymptomChecker from "@/components/SymptomChecker";

const Index = () => {
  const [showChecker, setShowChecker] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {!showChecker ? (
        <Hero onStartCheck={() => setShowChecker(true)} />
      ) : (
        <SymptomChecker onBack={() => setShowChecker(false)} />
      )}
    </div>
  );
};

export default Index;

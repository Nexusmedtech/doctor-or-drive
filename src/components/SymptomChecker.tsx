import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RecommendationCard from "./RecommendationCard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SymptomCheckerProps {
  onBack: () => void;
}

const SymptomChecker = ({ onBack }: SymptomCheckerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you decide whether to see your GP or visit the Emergency Department. Can you tell me what symptoms you're experiencing?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    urgency: "gp" | "nurse" | "ed";
    reason: string;
    nextSteps: string[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("symptom-triage", {
        body: { messages: newMessages },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
        } else if (error.message?.includes("402")) {
          toast({
            title: "Service unavailable",
            description: "Please try again later or contact support.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.recommendation) {
        setRecommendation(data.recommendation);
      } else if (data.response) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewCheck = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm here to help you decide whether to see your GP or visit the Emergency Department. Can you tell me what symptoms you're experiencing?",
      },
    ]);
    setRecommendation(null);
  };

  if (recommendation) {
    return <RecommendationCard recommendation={recommendation} onBack={onBack} onNewCheck={handleNewCheck} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Symptom Checker</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card border border-border shadow-soft"
                }`}
              >
                <p className={message.role === "user" ? "text-primary-foreground" : "text-foreground"}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-6 py-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-muted-foreground">Analyzing your symptoms...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="w-full px-6 py-4 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              disabled={isLoading}
              className="flex-1 bg-background border-border"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            This is not medical advice. In an emergency, call emergency services immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SymptomChecker;

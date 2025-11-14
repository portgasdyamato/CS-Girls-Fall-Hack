import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PersonaCard, { type PersonaType } from "./PersonaCard";
import { Sparkles } from "lucide-react";
import mentorAvatar from "@assets/generated_images/Mentor_persona_avatar_fc1437a0.png";
import friendlyAvatar from "@assets/generated_images/Friendly_persona_avatar_cd49d4db.png";
import calmAvatar from "@assets/generated_images/Calm_persona_avatar_7fc83d1b.png";

interface AuthPageProps {
  onStart: (persona: PersonaType) => void;
}

const personas = [
  {
    persona: "mentor" as const,
    name: "The Mentor",
    traits: ["Wise", "Supportive", "Encouraging"],
    image: mentorAvatar,
  },
  {
    persona: "friendly" as const,
    name: "The Friend",
    traits: ["Cheerful", "Energetic", "Fun"],
    image: friendlyAvatar,
  },
  {
    persona: "calm" as const,
    name: "The Calm",
    traits: ["Peaceful", "Gentle", "Patient"],
    image: calmAvatar,
  },
];

export default function AuthPage({ onStart }: AuthPageProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("mentor");
  const [step, setStep] = useState<"welcome" | "persona">("welcome");

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-lg w-full p-12 shadow-2xl backdrop-blur-sm bg-card/80 border-2">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-3xl mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-['Poppins'] mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Welcome to Study Buddy
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Your emotionally intelligent AI learning companion that adapts to your mood
                and supports your mental well-being while you study.
              </p>
            </div>
            <Button
              onClick={() => setStep("persona")}
              size="lg"
              className="w-full h-12 rounded-full shadow-lg text-base"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-['Poppins'] mb-3 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Choose Your Study Buddy
          </h2>
          <p className="text-muted-foreground text-lg">
            Select the personality that resonates with you
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {personas.map((p) => (
            <PersonaCard
              key={p.persona}
              {...p}
              selected={selectedPersona === p.persona}
              onSelect={() => setSelectedPersona(p.persona)}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => onStart(selectedPersona)}
            size="lg"
            className="px-12 h-12 rounded-full shadow-xl text-base"
            data-testid="button-start-chat"
          >
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
}

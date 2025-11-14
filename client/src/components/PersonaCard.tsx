import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export type PersonaType = "mentor" | "friendly" | "calm";

interface PersonaCardProps {
  persona: PersonaType;
  name: string;
  traits: string[];
  image: string;
  selected: boolean;
  onSelect: () => void;
}

export default function PersonaCard({
  persona,
  name,
  traits,
  image,
  selected,
  onSelect,
}: PersonaCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover-elevate active-elevate-2 ${
        selected ? "border-2 border-primary ring-2 ring-primary/20" : ""
      }`}
      onClick={onSelect}
      data-testid={`card-persona-${persona}`}
    >
      <div className="p-6 flex flex-col items-center text-center space-y-4">
        {selected && (
          <div className="absolute top-3 right-3">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="w-4 h-4" data-testid={`icon-selected-${persona}`} />
            </div>
          </div>
        )}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold font-['Poppins'] mb-2">{name}</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {traits.map((trait, idx) => (
              <span
                key={idx}
                className="text-sm text-muted-foreground"
                data-testid={`text-trait-${idx}`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

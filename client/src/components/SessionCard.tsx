import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import MoodTimeline from "./MoodTimeline";
import { type MoodType } from "./MoodBadge";

interface SessionCardProps {
  id: string;
  date: string;
  preview: string;
  moods: MoodType[];
  selected: boolean;
  onClick: () => void;
}

export default function SessionCard({
  date,
  preview,
  moods,
  selected,
  onClick,
}: SessionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
        selected ? "bg-sidebar-accent border-2 border-primary/30 shadow-md" : "bg-card/60 border-card-border"
      }`}
      onClick={onClick}
      data-testid="card-session"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium" data-testid="text-session-date">
            {date}
          </span>
        </div>
        <p className="text-sm line-clamp-2 mb-3 leading-relaxed" data-testid="text-session-preview">
          {preview}
        </p>
        {moods.length > 0 && (
          <div className="rounded-full overflow-hidden">
            <MoodTimeline moods={moods} />
          </div>
        )}
      </div>
    </Card>
  );
}

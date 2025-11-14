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
      className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
        selected ? "bg-sidebar-accent" : ""
      }`}
      onClick={onClick}
      data-testid="card-session"
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground" data-testid="text-session-date">
            {date}
          </span>
        </div>
        <p className="text-sm line-clamp-2 mb-3" data-testid="text-session-preview">
          {preview}
        </p>
        {moods.length > 0 && (
          <div className="rounded overflow-hidden">
            <MoodTimeline moods={moods} />
          </div>
        )}
      </div>
    </Card>
  );
}

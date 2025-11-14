import { Button } from "@/components/ui/button";
import { Coffee, X } from "lucide-react";

interface BreakSuggestionProps {
  message: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export default function BreakSuggestion({
  message,
  onAccept,
  onDismiss,
}: BreakSuggestionProps) {
  return (
    <div
      className="bg-mood-motivated/20 border border-mood-motivated/30 rounded-xl p-4 my-4"
      data-testid="notification-break"
    >
      <div className="flex items-start gap-3">
        <div className="bg-mood-motivated text-mood-motivated-foreground p-2 rounded-lg">
          <Coffee className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-base mb-3">{message}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onAccept}
              data-testid="button-accept-break"
            >
              Take a break
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              data-testid="button-dismiss-break"
            >
              Continue studying
            </Button>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDismiss}
          className="h-8 w-8"
          data-testid="button-close-break"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

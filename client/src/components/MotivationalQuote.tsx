import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface MotivationalQuoteProps {
  quote: string;
  author?: string;
}

export default function MotivationalQuote({ quote, author }: MotivationalQuoteProps) {
  return (
    <Card className="border-l-4 border-l-primary bg-accent/30 my-4" data-testid="card-quote">
      <div className="p-4">
        <div className="flex gap-3">
          <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="italic text-base mb-2">{quote}</p>
            {author && (
              <p className="text-sm text-muted-foreground" data-testid="text-quote-author">
                — {author}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

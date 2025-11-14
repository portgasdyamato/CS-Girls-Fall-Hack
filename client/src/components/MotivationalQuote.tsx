import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface MotivationalQuoteProps {
  quote: string;
  author?: string;
}

export default function MotivationalQuote({ quote, author }: MotivationalQuoteProps) {
  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-br from-accent/40 to-accent/20 backdrop-blur-sm my-6 shadow-md" data-testid="card-quote">
      <div className="p-6">
        <div className="flex gap-4">
          <div className="bg-primary/10 p-2 rounded-full h-fit">
            <Quote className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div>
            <p className="italic text-base mb-3 leading-relaxed">{quote}</p>
            {author && (
              <p className="text-sm text-muted-foreground font-medium" data-testid="text-quote-author">
                — {author}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

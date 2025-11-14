import MoodBadge, { type MoodType } from "./MoodBadge";
import TypingIndicator from "./TypingIndicator";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  mood?: MoodType;
  isTyping?: boolean;
  timestamp?: string;
}

export default function MessageBubble({
  content,
  isUser,
  mood,
  isTyping = false,
  timestamp,
}: MessageBubbleProps) {
  if (isTyping && !isUser) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-2xl">
          <div className="inline-block bg-card border border-card-border rounded-2xl rounded-tl-sm">
            <TypingIndicator />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className="max-w-2xl">
        {!isUser && mood && (
          <div className="mb-2">
            <MoodBadge mood={mood} />
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-card-border rounded-tl-sm"
          }`}
          data-testid={isUser ? "bubble-user-message" : "bubble-ai-message"}
        >
          <p className="text-base whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <p className="text-xs mt-2 opacity-60" data-testid="text-timestamp">
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

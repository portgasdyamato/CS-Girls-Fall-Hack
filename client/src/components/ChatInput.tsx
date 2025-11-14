import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/20 dark:border-border/30 p-6 bg-white/30 dark:bg-card/30 backdrop-blur-2xl">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          className="resize-none min-h-[48px] max-h-32 rounded-3xl shadow-sm border bg-white/60 dark:bg-card/60 backdrop-blur-xl border-white/40 dark:border-card-border/40"
          rows={1}
          disabled={disabled}
          data-testid="input-chat-message"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          data-testid="button-send-message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

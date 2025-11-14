import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import MoodTimeline from "./MoodTimeline";
import SessionCard from "./SessionCard";
import ThemeToggle from "./ThemeToggle";
import MotivationalQuote from "./MotivationalQuote";
import BreakSuggestion from "./BreakSuggestion";
import { type MoodType } from "./MoodBadge";
import { Menu, Plus, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  mood?: MoodType;
  timestamp: string;
}

interface Session {
  id: string;
  date: string;
  preview: string;
  moods: MoodType[];
}

interface ChatInterfaceProps {
  userName?: string;
}

export default function ChatInterface({ userName = "Student" }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm feeling really stressed about my upcoming exam.",
      isUser: true,
      timestamp: "2:30 PM",
    },
    {
      id: "2",
      content: "I hear you - exam stress is completely normal. Let's take a moment to breathe together. What subject are you studying?",
      isUser: false,
      mood: "anxious",
      timestamp: "2:31 PM",
    },
  ]);

  const [sessions] = useState<Session[]>([
    {
      id: "1",
      date: "Today, 2:30 PM",
      preview: "Studying calculus and feeling stressed...",
      moods: ["anxious", "calm", "motivated"],
    },
    {
      id: "2",
      date: "Yesterday, 4:15 PM",
      preview: "Working on chemistry homework...",
      moods: ["motivated", "calm"],
    },
  ]);

  const [selectedSession, setSelectedSession] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBreak, setShowBreak] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentMoods: MoodType[] = messages
    .filter((m) => !m.isUser && m.mood)
    .map((m) => m.mood!);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question! Let me help you with that.",
        isUser: false,
        mood: "calm",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <div className="w-80 border-r-2 border-sidebar-border/50 bg-sidebar/60 backdrop-blur-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-['Poppins']">Sessions</h2>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full hover:bg-primary/10"
              data-testid="button-new-session"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-2">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  {...session}
                  selected={selectedSession === session.id}
                  onClick={() => setSelectedSession(session.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b-2 border-border/50 flex items-center justify-between px-8 bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full"
              data-testid="button-toggle-sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-bold font-['Poppins'] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Study Buddy
              </h1>
              <p className="text-sm text-muted-foreground">Here to support you</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {currentMoods.length > 0 && (
          <div className="shadow-sm">
            <MoodTimeline moods={currentMoods} />
          </div>
        )}

        <ScrollArea className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} {...message} />
            ))}
            {isTyping && <MessageBubble content="" isUser={false} isTyping={true} />}
            
            {showBreak && (
              <BreakSuggestion
                message="You've been studying for a while. How about a 5-minute break to recharge?"
                onAccept={() => {
                  console.log("Break accepted");
                  setShowBreak(false);
                }}
                onDismiss={() => setShowBreak(false)}
              />
            )}
            
            <MotivationalQuote
              quote="The beautiful thing about learning is that no one can take it away from you."
              author="B.B. King"
            />
          </div>
        </ScrollArea>

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}

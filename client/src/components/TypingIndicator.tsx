export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-3" data-testid="indicator-typing">
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
    </div>
  );
}

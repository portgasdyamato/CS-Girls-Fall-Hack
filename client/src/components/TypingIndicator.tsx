export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 px-5 py-4" data-testid="indicator-typing">
      <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" />
    </div>
  );
}

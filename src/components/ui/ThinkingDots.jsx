export default function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[7px] w-[7px] rounded-full bg-[#6366f1] animate-bounce3" style={{ animationDelay: `${i * 0.2}s` }}/>
      ))}
    </div>
  );
}

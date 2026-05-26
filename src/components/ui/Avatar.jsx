export function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

export function BotAvatar({ size = 32 }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5"/>
        <circle cx="7"  cy="9"  r="1.5" fill="white"/>
        <circle cx="13" cy="9"  r="1.5" fill="white"/>
        <path d="M7 13c.8 1 5.2 1 6 0" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

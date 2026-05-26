import { useTheme } from '../../hooks/useTheme';

export default function IconButton({ onClick, title, children, active = false, danger = false, className = '', style = {} }) {
  const { dark, hover, muted } = useTheme();
  const tone = danger ? 'text-red-500 hover:text-red-500' : active ? 'text-[#6366f1]' : muted;
  const hoverTone = dark ? 'hover:text-[#e8e8f0]' : 'hover:text-[#1a1a2e]';

  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1.5 transition-colors ${hover} ${tone} ${!danger && !active ? hoverTone : ''} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

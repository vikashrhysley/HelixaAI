import { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function PlusMenu({ open, onClose, onFile, onScreenshot }) {
  const fileRef = useRef(null);
  const { card, border, text, hover } = useTheme();

  const handleFile = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFile(files);
    e.target.value = '';
    onClose();
  };

  if (!open) return null;

  const items = [
    {
      label: 'Take screenshot',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      ),
      action: () => { onScreenshot(); onClose(); },
    },
    {
      label: 'Add file',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      ),
      action: () => fileRef.current?.click(),
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[98]" onClick={onClose}/>
      <div className={`absolute bottom-11 left-0 z-[99] min-w-[190px] overflow-hidden rounded-xl border shadow-[0_8px_32px_rgba(0,0,0,0.22)] animate-fadeUp ${card} ${border}`}>
        {items.map(({ label, icon, action }) => (
          <button key={label} onClick={action} className={`flex w-full cursor-pointer items-center gap-[7px] border-0 bg-transparent px-3.5 py-[9px] text-left font-sans text-[13.5px] transition-colors ${text} ${hover}`}>
            {icon}{label}
          </button>
        ))}
        <input type="file" ref={fileRef} className="hidden" multiple onChange={handleFile}/>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModel, selectModel } from '../../store/slices/uiSlice';
import { MODELS, PROVIDER_LABELS } from '../../constants/models';
import { useTheme } from '../../hooks/useTheme';

export default function ModelDropdown() {
  const dispatch = useDispatch();
  const modelId = useSelector(selectModel);
  const { dark, card, border, text, muted, hover } = useTheme();
  const [open, setOpen] = useState(false);

  const current = MODELS.find((m) => m.id === modelId);
  const groups = MODELS.reduce((acc, m) => {
    const g = PROVIDER_LABELS[m.provider] ?? m.provider;
    (acc[g] = acc[g] ?? []).push(m);
    return acc;
  }, {});
  const pillBg = dark ? 'bg-[#38383E]' : 'bg-[#e8e8ff]';

  return (
    <div className="relative">
      <button onClick={() => setOpen((p) => !p)} className={`flex cursor-pointer items-center gap-[5px] rounded-lg border-0 px-2.5 py-[5px] font-sans text-[12.5px] transition-colors ${pillBg} ${text}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        {current?.label ?? modelId}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[98]" onClick={() => setOpen(false)}/>
          <div className={`absolute bottom-9 right-0 z-[99] min-w-[220px] overflow-hidden rounded-xl border shadow-[0_8px_32px_rgba(0,0,0,0.22)] animate-fadeUp ${card} ${border}`}>
            {Object.entries(groups).map(([group, models]) => (
              <div key={group}>
                <p className={`px-3.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] ${muted}`}>{group}</p>
                {models.map((m) => {
                  const selected = m.id === modelId && !m.comingSoon;
                  return (
                    <div
                      key={m.id}
                      onClick={() => { if (!m.comingSoon) { dispatch(setModel(m.id)); setOpen(false); } }}
                      className={`flex items-center gap-2 px-3.5 py-[9px] text-[13.5px] transition-colors ${m.comingSoon ? `cursor-default opacity-60 ${muted}` : `cursor-pointer ${text} ${hover}`}`}
                    >
                      {selected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      <span className={selected ? '' : 'ml-[22px]'}>{m.label}</span>
                      {m.comingSoon && (
                        <span className={`ml-auto rounded-md px-[7px] py-0.5 text-[10px] font-semibold text-[#6366f1] ${pillBg}`}>Soon</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

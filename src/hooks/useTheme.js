import { useSelector } from 'react-redux';
import { selectDarkMode } from '../store/slices/uiSlice';

/**
 * Returns a `t(darkClass, lightClass)` helper and the raw darkMode boolean.
 * Usage:  const { t, dark } = useTheme();
 *         className={t('text-white', 'text-black')}
 */
export function useTheme() {
  const dark = useSelector(selectDarkMode);
  const t = (darkClass, lightClass) => (dark ? darkClass : lightClass);

  // Convenient grouped tokens
  const tokens = {
    bg:      t('bg-[#28282B]',  'bg-[#f8f7ff]'),
    sidebar: t('bg-[#28282B]',  'bg-[#f0f0fa]'),
    chat:    t('bg-[#28282B]',  'bg-white'),
    card:    t('bg-[#323237]',  'bg-white'),
    input:   t('bg-[#38383E]',  'bg-[#f4f4fc]'),
    border:  t('border-[#484850]', 'border-[#e0e0f0]'),
    text:    t('text-[#e8e8f0]', 'text-[#1a1a2e]'),
    muted:   'text-[#7878a0]',
    hover:   t('hover:bg-[#38383E]', 'hover:bg-[#eeeeff]'),
    msgBot:  t('bg-[#323237]',  'bg-[#f3f3ff]'),
    // raw hex values (for inline styles)
    textHex:   t('#e8e8f0', '#1a1a2e'),
    mutedHex:  '#7878a0',
    borderHex: t('#484850', '#e0e0f0'),
    inputHex:  t('#38383E', '#f4f4fc'),
    hoverHex:  t('#38383E', '#eeeeff'),
    bgHex:     t('#28282B', '#f8f7ff'),
    sidebarHex:t('#28282B', '#f0f0fa'),
    chatHex:   t('#28282B', '#ffffff'),
    cardHex:   t('#323237', '#ffffff'),
    msgBotHex: t('#323237', '#f3f3ff'),
  };

  return { dark, t, ...tokens };
}

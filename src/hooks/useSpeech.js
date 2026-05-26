import { useState, useRef } from 'react';

export function useSpeech(onResult) {
  const [listening, setListening] = useState(false);
  const ref = useRef(null);

  const toggle = () => {
    if (listening) {
      ref.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => onResult(e.results[0][0].transcript + ' ');
    r.onend    = ()  => setListening(false);
    r.start();
    ref.current = r;
    setListening(true);
  };

  return { listening, toggle };
}

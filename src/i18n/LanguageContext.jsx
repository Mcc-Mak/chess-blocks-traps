import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { STRINGS, DEFAULT_LANG, LANG } from './strings.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === LANG.TC ? LANG.EN : LANG.TC));
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: STRINGS[lang] }),
    [lang, toggle]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider');
  return ctx;
}

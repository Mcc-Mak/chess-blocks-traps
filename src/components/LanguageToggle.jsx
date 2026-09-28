import { useI18n } from '../i18n/LanguageContext.jsx';

export default function LanguageToggle() {
  const { toggle, t } = useI18n();
  return (
    <button
      className="lang-toggle"
      onClick={toggle}
      title={t.switchLabel}
      aria-label={t.switchLabel}
    >
      {t.switchTo}
    </button>
  );
}

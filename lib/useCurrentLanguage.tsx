import { useTranslations } from 'next-intl';

export function useCurrentLanguage() {
  const t = useTranslations();

  const currentLanguage = t('Languages.this');

  return currentLanguage;
}

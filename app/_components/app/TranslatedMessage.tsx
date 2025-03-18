import { useTranslations } from 'next-intl';

interface TranslatedMessageProps {
  tKey: string;
}

export const TranslatedMessage: React.FC<TranslatedMessageProps> = ({
  tKey,
}) => {
  const t = useTranslations();

  return <>{t(tKey)}</>;
};

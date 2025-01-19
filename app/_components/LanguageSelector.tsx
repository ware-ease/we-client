'use client';
import React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import classNames from 'classnames';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface LanguageSelectorProps {
  size?: number;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ size = 24 }) => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none hover:bg-accent p-2 rounded-lg'>
        <Globe size={size} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-opacity-90'>
        <Link href={pathname} locale='vi'>
          <DropdownMenuItem
            disabled={t('Languages.this') === 'vi'}
            className={classNames({
              'font-bold': t('Languages.this') === 'vi',
            })}
          >
            {t('Languages.vi')}
          </DropdownMenuItem>
        </Link>
        <Link href={pathname} locale='en'>
          <DropdownMenuItem
            disabled={t('Languages.this') === 'en'}
            className={classNames({
              'font-bold': t('Languages.this') === 'en',
            })}
          >
            {t('Languages.en')}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

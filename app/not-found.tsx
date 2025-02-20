import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();

  return (
    <section className='bg-white'>
      <div className='flex flex-col justify-center items-center h-screen w-screen'>
        <div className='text-center w-full'>
          <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary'>
            404
          </h1>
          <p className='mb-4 text-3xl tracking-tight font-bold text-primary md:text-4xl'>
            {t('404.title')}
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400 w-full'>
            {t('404.description')}{' '}
            <Link href='/' className='text-primary font-semibold'>
              {t('404.back')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

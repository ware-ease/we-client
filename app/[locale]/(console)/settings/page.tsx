import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/shadcn-base/Avatar';
import { Button } from '@/app/_components/shadcn-base/Button';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/app/_components/shadcn-base/RadioGroup';
import { useTranslations } from 'next-intl';

const Settings = () => {
  const t = useTranslations();

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col p-4 gap-6'>
        <div className='text-4xl font-semibold text-primary'>
          <div>{t('Settings.title')}</div>
        </div>
        <div className='flex flex-col p-4 gap-6 max-h-[80vh] overflow-y-auto'>
          <div className='flex flex-col border-2 rounded-md w-3/4'>
            <div className='p-4 text-xl text-primary border-b-2'>
              <div>{t('Settings.profile')}</div>
            </div>
            <div className='p-4 flex flex-col gap-3'>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.avatar')}
                </div>
                <Avatar className='size-16 hover:cursor-pointer'>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center ml-6'>
                  <div className='hover:font-semibold hover:cursor-pointer'>
                    {t('Settings.change')}
                  </div>
                  <div className='hover:font-bold hover:cursor-pointer text-red-500 font-semibold'>
                    {t('Settings.remove')}
                  </div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.lastname')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.firstname')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.email')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.phone')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.address')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex py-2'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.sex')}
                </div>
                <RadioGroup className='flex' defaultValue='option-one'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      className='fill-blue-500'
                      value='option-one'
                      id='option-one'
                    />
                    <Label htmlFor='option-one'>Nam</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      className=''
                      value='option-two'
                      id='option-two'
                    />
                    <Label htmlFor='option-two'>Nữ</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Settings.nation')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='w-3/5 text-right'>
                <Button className='bg-green-700 hover:bg-green-950'>
                  {t('Settings.update')}
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-col border-2 rounded-md w-3/4'>
            <div className='p-4 text-xl text-primary border-b-2'>
              <div>{t('Settings.account')}</div>
            </div>
            <div className='p-4 flex flex-col gap-3'>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Login.username')}
                </div>
                <Input className='border-gray-300 w-2/5' />
              </div>
              <div className='flex'>
                <div className='flex items-center w-1/5'>
                  {t('Login.password')}
                </div>
                <Input type='password' className='border-gray-300 w-2/5' />
              </div>
              <div className='w-3/5 text-right'>
                <Button className='bg-green-700 hover:bg-green-950'>
                  {t('Settings.update')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

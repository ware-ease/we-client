'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/shadcn-base/Avatar';
import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/app/_components/shadcn-base/RadioGroup';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import ConfirmDialog from '@/app/_components/ConfirmDialog';

const Settings = () => {
  const t = useTranslations();

  const [avatar, setAvatar] = useState<string>('https://github.com/shadcn.png');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAvatarChangeClick = () => {
    setPreview(avatar);
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleAvatarChangeConfirm = async () => {
    if (!file) return;

    const toastId = toast.loading(t('Toast.uploading'));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'wareease_avatar_unsigned');

      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL as string,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      setAvatar(data.secure_url);

      toast.update(toastId, {
        render: t('Toast.success'),
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      if (preview) {
        setAvatar(preview);
        setPreview(null);
      }
    } catch {
      const errorMessage = t('Toast.error');

      toast.update(toastId, {
        render: `${errorMessage}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col p-4 gap-6'>
        <div className='text-4xl font-semibold text-primary'>
          <div>{t('Settings.title')}</div>
        </div>
        <div className='flex flex-col p-4 gap-6 max-h-[80vh] overflow-y-auto'>
          <div className='flex border-2 rounded-md w-full'>
            <div className='flex-col w-full'>
              <div className='p-4 text-xl text-primary border-b-2'>
                <div>{t('Settings.profile')}</div>
              </div>
              <div className='flex justify-between relative'>
                <div className='w-3/4 p-4 flex flex-col gap-3'>
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
                        <Label htmlFor='option-one'>{t('Settings.male')}</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          className=''
                          value='option-two'
                          id='option-two'
                        />
                        <Label htmlFor='option-two'>
                          {t('Settings.female')}
                        </Label>
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
                <div className='flex flex-col w-1/4 absolute right-20 py-4 gap-3'>
                  <div className='flex items-center font-semibold'>
                    {t('Settings.avatar')}
                  </div>
                  <Avatar className='size-48 hover:cursor-pointer'>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center'>
                    <Dialog onOpenChange={handleAvatarChangeClick}>
                      <DialogTrigger asChild>
                        <div className='hover:font-semibold hover:cursor-pointer'>
                          {t('Settings.change')}
                        </div>
                      </DialogTrigger>
                      <DialogContent className='max-w-md'>
                        <DialogHeader>
                          <DialogTitle>{t('Settings.upload')}</DialogTitle>
                          <DialogDescription>
                            {t('Settings.choose')}
                          </DialogDescription>
                        </DialogHeader>
                        {preview && (
                          <div className='flex flex-col items-center gap-6 justify-center mt-2'>
                            <Avatar className='size-40'>
                              <AvatarImage src={preview} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Input
                              className='w-96'
                              type='file'
                              accept='image/*'
                              onChange={handleAvatarUpload}
                            />
                          </div>
                        )}

                        <DialogFooter className='justify-end'>
                          <DialogClose asChild>
                            <Button
                              variant='secondary'
                              className='hover:bg-slate-200'
                            >
                              {t('Dialog.cancel')}
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleAvatarChangeConfirm}>
                              {t('Dialog.yes.update')}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <ConfirmDialog
                      title={t('Settings.removeAvatar')}
                      description={t('Settings.removeAvatarDescription')}
                      onConfirm={() => {}}
                      triggerElement={
                        <div className='hover:font-bold hover:cursor-pointer text-red-500 font-semibold'>
                          {t('Settings.remove')}
                        </div>
                      }
                      confirmBgColor='bg-red-500 hover:bg-red-800'
                      confirmText={t('Settings.remove')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex border-2 rounded-md w-full'>
            <div className='flex-col w-full'>
              <div className='p-4 text-xl text-primary border-b-2'>
                <div>{t('Settings.account')}</div>
              </div>
              <div className='p-4 flex flex-col gap-3 w-3/4'>
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
    </div>
  );
};

export default Settings;

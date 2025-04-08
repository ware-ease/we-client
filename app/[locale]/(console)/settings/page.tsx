'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn-base/Avatar';
import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/shadcn-base/RadioGroup';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useState, useEffect } from 'react';
import ConfirmDialog from '@/components/app/ConfirmDialog';
import ChangePassword from './ChangePassword';
import { useUpdateAccount } from '@/hooks/queries/accountQueries';
import { AccountUpdate, ProfileUpdate } from '@/types/account';
import { useAuth } from '@/components/providers/AuthProvider';

const Settings = () => {
  const t = useTranslations();
  const updateAccountMutation = useUpdateAccount();
  const { currentUser } = useAuth();

  const [avatar, setAvatar] = useState<string>('https://github.com/shadcn.png');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Form state matching AccountUpdate DTO
  const [accountData, setAccountData] = useState<AccountUpdate>({
    id: '',
    email: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      sex: true, // Default to male (true)
      nationality: '',
      avatarUrl: 'https://github.com/shadcn.png',
    },
  });

  // Sync accountData and avatar with currentUser when it changes
  useEffect(() => {
    if (currentUser) {
      setAccountData({
        id: currentUser.id || '',
        email: currentUser.email || '',
        profile: {
          firstName: currentUser.profile?.firstName || '',
          lastName: currentUser.profile?.lastName || '',
          phone: currentUser.profile?.phone || '',
          address: currentUser.profile?.address || '',
          sex: currentUser.profile?.sex ?? true,
          nationality: currentUser.profile?.nationality || '',
          avatarUrl:
            currentUser.profile?.avatarUrl || 'https://github.com/shadcn.png',
        },
      });
      setAvatar(
        currentUser.profile?.avatarUrl || 'https://github.com/shadcn.png'
      );
    }
  }, [currentUser]);

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
      const newAvatarUrl = data.secure_url;
      setAvatar(newAvatarUrl);

      // Update accountData with new avatar URL, ensuring all fields are present
      setAccountData((prev) => ({
        ...prev,
        profile: {
          firstName: prev.profile?.firstName || '',
          lastName: prev.profile?.lastName || '',
          phone: prev.profile?.phone || '',
          address: prev.profile?.address || '',
          sex: prev.profile?.sex ?? true,
          nationality: prev.profile?.nationality || '',
          avatarUrl: newAvatarUrl,
        },
      }));

      toast.update(toastId, {
        render: t('Toast.success'),
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      if (preview) {
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

  // Handle input changes for top-level fields (id, email)
  const handleTopLevelChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'id' | 'email'
  ) => {
    setAccountData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Handle input changes for profile fields
  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof ProfileUpdate
  ) => {
    setAccountData((prev) => ({
      ...prev,
      profile: {
        firstName: prev.profile?.firstName || '',
        lastName: prev.profile?.lastName || '',
        phone: prev.profile?.phone || '',
        address: prev.profile?.address || '',
        sex: prev.profile?.sex ?? true,
        nationality: prev.profile?.nationality || '',
        avatarUrl: prev.profile?.avatarUrl || 'https://github.com/shadcn.png',
        [field]: e.target.value,
      },
    }));
  };

  // Handle radio group change for sex
  const handleSexChange = (value: string) => {
    setAccountData((prev) => ({
      ...prev,
      profile: {
        firstName: prev.profile?.firstName || '',
        lastName: prev.profile?.lastName || '',
        phone: prev.profile?.phone || '',
        address: prev.profile?.address || '',
        sex: value === 'male', // true for male, false for female
        nationality: prev.profile?.nationality || '',
        avatarUrl: prev.profile?.avatarUrl || 'https://github.com/shadcn.png',
      },
    }));
  };

  // Helper to filter out empty strings from an object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterEmptyStrings = (obj: any): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const nested = filterEmptyStrings(obj[key]);
          if (Object.keys(nested).length > 0) {
            result[key] = nested;
          }
        } else if (
          obj[key] !== '' &&
          obj[key] !== undefined &&
          obj[key] !== null
        ) {
          result[key] = obj[key];
        }
      }
    }
    return result;
  };

  // Handle form submission
  const handleUpdateAccount = () => {
    // Filter out empty strings to avoid overwriting with PATCH
    const cleanedData: AccountUpdate = filterEmptyStrings(accountData);

    // Ensure id is always included, even if empty (for PATCH to identify the resource)
    if (currentUser?.id && !cleanedData.id) {
      cleanedData.id = currentUser.id;
    }

    updateAccountMutation.mutate(cleanedData);
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
              <div className='flex justify-between relative px-4'>
                <div className='w-1/2 p-4 flex flex-col gap-3'>
                  {/* Email (top-level field) */}
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.email')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.email || ''}
                      onChange={(e) => handleTopLevelChange(e, 'email')}
                    />
                  </div>
                  {/* Profile fields */}
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.lastname')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.profile?.lastName || ''}
                      onChange={(e) => handleProfileChange(e, 'lastName')}
                    />
                  </div>
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.firstname')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.profile?.firstName || ''}
                      onChange={(e) => handleProfileChange(e, 'firstName')}
                    />
                  </div>
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.phone')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.profile?.phone || ''}
                      onChange={(e) => handleProfileChange(e, 'phone')}
                    />
                  </div>
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.address')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.profile?.address || ''}
                      onChange={(e) => handleProfileChange(e, 'address')}
                    />
                  </div>
                  <div className='flex py-2'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.sex')}
                    </div>
                    <RadioGroup
                      className='flex'
                      value={accountData.profile?.sex ? 'male' : 'female'}
                      onValueChange={handleSexChange}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          className='fill-blue-500'
                          value='male'
                          id='male'
                        />
                        <Label htmlFor='male'>{t('Settings.male')}</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          className=''
                          value='female'
                          id='female'
                        />
                        <Label htmlFor='female'>{t('Settings.female')}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className='flex'>
                    <div className='flex items-center w-2/5'>
                      {t('Settings.nation')}
                    </div>
                    <Input
                      className='border-gray-300 w-3/5'
                      value={accountData.profile?.nationality || ''}
                      onChange={(e) => handleProfileChange(e, 'nationality')}
                    />
                  </div>
                  <div className='w-full pt-3 text-right'>
                    <Button
                      className='bg-green-700 hover:bg-green-950'
                      onClick={handleUpdateAccount}
                      disabled={updateAccountMutation.isPending}
                    >
                      {t('Settings.update')}
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col w-1/4 absolute right-20 items-center py-4 gap-3'>
                  <div className='flex items-center font-semibold'>
                    {t('Settings.avatar')}
                  </div>
                  <Avatar className='size-60 hover:cursor-pointer'>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center items-center'>
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
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

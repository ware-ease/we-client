import { cn } from '@/lib/utils/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn-base/Popover';
import { Progress } from '../shadcn-base/Progress';

export const checkPasswordStrength = (password: string) => {
  const lengthCheck = password.length >= 8;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const digitCheck = /\d/.test(password);
  const specialCharCheck = /[\W_]/.test(password);

  const passedChecks = [
    lengthCheck,
    uppercaseCheck,
    lowercaseCheck,
    digitCheck,
    specialCharCheck,
  ].filter(Boolean).length;
  return passedChecks;
};

const getPassedCheck = (password: string) => {
  const lengthCheck = password.length >= 8;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const digitCheck = /\d/.test(password);
  const specialCharCheck = /[\W_]/.test(password);

  const passedChecks = {
    lengthCheck,
    uppercaseCheck,
    lowercaseCheck,
    digitCheck,
    specialCharCheck,
  };
  return passedChecks;
};

const PasswordStrength = ({ password }: { password: string }) => {
  const strength = checkPasswordStrength(password);
  const progressColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
  ];

  return (
    <div className='mt-2'>
      <div className='w-full bg-gray-200 h-2 rounded-md'>
        <Popover>
          <PopoverTrigger asChild>
            <Progress
              className='hover:cursor-pointer'
              indicatorClassName={`${progressColors[strength - 1]}`}
              value={checkPasswordStrength(password) * 20}
            ></Progress>
          </PopoverTrigger>
          <PopoverContent>
            <div className='flex flex-col text-sm font-semibold'>
              <div
                className={cn(
                  'flex',
                  getPassedCheck(password).lengthCheck
                    ? 'text-green-700'
                    : 'text-red-500'
                )}
              >
                <p>Mật khẩu phải có ít nhất 8 ký tự.</p>
              </div>
              <div
                className={cn(
                  'flex',
                  getPassedCheck(password).lowercaseCheck
                    ? 'text-green-700'
                    : 'text-red-500'
                )}
              >
                <p>Mật khẩu phải có ít nhất 1 chữ thường.</p>
              </div>
              <div
                className={cn(
                  'flex',
                  getPassedCheck(password).uppercaseCheck
                    ? 'text-green-700'
                    : 'text-red-500'
                )}
              >
                <p>Mật khẩu phải có ít nhất 1 chữ in hoa.</p>
              </div>
              <div
                className={cn(
                  'flex',
                  getPassedCheck(password).digitCheck
                    ? 'text-green-700'
                    : 'text-red-500'
                )}
              >
                <p>Mật khẩu phải có ít nhất 1 số.</p>
              </div>
              <div
                className={cn(
                  'flex',
                  getPassedCheck(password).specialCharCheck
                    ? 'text-green-700'
                    : 'text-red-500'
                )}
              >
                <p>Mật khẩu phải có ít nhất 1 ký tự đặc biệt.</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PasswordStrength;

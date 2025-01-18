import Image from 'next/image';
import '../../globals.css';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex w-screen h-screen'>
      <Image
        src='/login.svg'
        alt=''
        fill
        className='-z-10 object-cover object-center'
      />
      <div className='w-[50vw] h-screen relative'></div>
      <div className='flex justify-center items-center w-[50vw]'>
        {children}
      </div>
    </div>
  );
}

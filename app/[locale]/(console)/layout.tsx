import { SidebarProvider, SidebarTrigger } from '@/app/_components/SideBar';
import '../../globals.css';
import { AppSidebar } from '@/app/_components/AppSidebar';

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <div className='flex w-full h-full'>
    //   <div className='w-[20vw] h-screen relative bg-primary text-white'>
    //     Sidebar
    //   </div>
    //   <div className='flex flex-col w-[80vw]'>
    //     <div className='w-full max-w-[80vw] h-12'>Navbar</div>
    //     <>{children}</>
    //   </div>
    // </div>
    <SidebarProvider className='flex w-screen h-screen max-w-screen max-h-screen'>
      <AppSidebar />
      <div className='flex flex-col w-full justify-between'>
        <div className='flex w-full h-12 flex-grow-1 items-center'>
          <SidebarTrigger className='p-5' />
        </div>
        <div className='w-full max-h-[100%]'>{children}</div>
      </div>
    </SidebarProvider>
  );
}

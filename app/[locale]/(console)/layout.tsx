import { SidebarProvider } from '@/app/_components/shadcn-base/SideBar';
import '../../globals.css';
import { AppSidebar } from '@/app/_components/app/AppSidebar';
import Nav from '@/app/_components/app/Nav';
import ProtectedRoute from '@/app/_components/app/ProtectedRoute';

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
      <ProtectedRoute>
        <AppSidebar />
        <div className='flex flex-col w-full'>
          <Nav />
          <div className='w-full max-h-[100%]'>{children}</div>
        </div>
      </ProtectedRoute>
    </SidebarProvider>
  );
}

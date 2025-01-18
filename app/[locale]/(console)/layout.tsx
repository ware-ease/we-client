import '../../globals.css';

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex w-screen h-screen'>
      <div className='w-[20vw] h-screen relative bg-primary text-white'>
        Sidebar
      </div>
      <div className='flex flex-col w-full'>
        <div className='w-full h-12'>Navbar</div>
        <>{children}</>
      </div>
    </div>
  );
}

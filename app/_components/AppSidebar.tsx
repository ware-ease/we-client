'use client';
import { Home, LogOut, Settings, UsersRound } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './SideBar';
import { Link } from '@/i18n/routing';
import { useCurrentLanguage } from '@/lib/useCurrentLanguage';
import { usePathname } from 'next/navigation';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Accounts',
    url: '/accounts',
    icon: UsersRound,
  },
];

const botItems = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Log out',
    url: '/logout',
    icon: LogOut,
  },
];

export function AppSidebar() {
  const lang = useCurrentLanguage();
  const pathname = usePathname();

  return (
    <Sidebar className='max-h-full text-white text-3xl'>
      <SidebarHeader className='flex justify-center items-center py-6 pt-10'>
        WareEase
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.slice(3) === item.url;
                return (
                  <SidebarMenuItem className='my-2' key={item.title}>
                    <Link href={item.url} locale={lang}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className='flex items-center space-x-2 px-4'
                      >
                        <item.icon className='size-4' />
                        <span className='text-md'>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarGroup className='mb-4'>
        <SidebarGroupContent>
          <SidebarMenu>
            {botItems.map((item) => {
              const isActive = pathname.slice(3) === item.url;
              return (
                <SidebarMenuItem className='my-2' key={item.title}>
                  <Link href={item.url} locale={lang}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className='flex items-center space-x-2 px-4'
                    >
                      <item.icon className='size-4' />
                      <span className='text-md'>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}

'use client';
import { Home, LogOut, PackageOpen, Settings, UsersRound } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './shadcn-base/SideBar';
import { Link } from '@/i18n/routing';
import { useCurrentLanguage } from '@/lib/useCurrentLanguage';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function AppSidebar() {
  const lang = useCurrentLanguage();
  const pathname = usePathname();
  const t = useTranslations();

  const items = [
    {
      title: t('Sidebar.dashboard'),
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t('Sidebar.accounts'),
      url: '/accounts',
      icon: UsersRound,
    },
  ];

  const botItems = [
    {
      title: t('Sidebar.settings'),
      url: '/settings',
      icon: Settings,
    },
    {
      title: t('Sidebar.logout'),
      url: '/logout',
      icon: LogOut,
    },
  ];

  return (
    <Sidebar collapsible='icon' className='max-h-full text-white text-3xl'>
      <SidebarHeader className='flex justify-center items-center py-6 pt-10'>
        <SidebarMenu className='items-center'>
          <SidebarMenuItem>
            <SidebarMenuButton className='flex items-center space-x-2 px-4 text-xl !bg-transparent !cursor-default'>
              <PackageOpen className='!size-8 group-data-[collapsible=icon]:!size-4' />
              <span className='text-2xl'>WareEase</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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

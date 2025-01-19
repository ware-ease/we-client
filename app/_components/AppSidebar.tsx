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

  return (
    <Sidebar className='max-h-full text-white text-3xl'>
      <SidebarHeader className='flex justify-center items-center py-6 pt-10'>
        WareEase
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className='my-2' key={item.title}>
                  <SidebarMenuButton>
                    <Link
                      className='flex items-center space-x-2 px-2'
                      href={item.url}
                      locale={lang}
                    >
                      <item.icon className='size-4' />
                      <span className='text-md'>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarGroup className='mb-4'>
        <SidebarGroupContent>
          <SidebarMenu>
            {botItems.map((item) => (
              <SidebarMenuItem className='my-2' key={item.title}>
                <SidebarMenuButton>
                  <Link
                    className='flex items-center space-x-2 px-2'
                    href={item.url}
                    locale={lang}
                  >
                    <item.icon className='size-4' />
                    <span className='text-md'>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}

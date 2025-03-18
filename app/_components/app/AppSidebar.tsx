'use client';
import {
  Boxes,
  Home,
  LayoutDashboardIcon,
  LogOut,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  Settings,
  UsersRound,
  Warehouse,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../shadcn-base/SideBar';
import { Link, useRouter } from '@/i18n/routing';
import { useCurrentLanguage } from '@/lib/hooks/useCurrentLanguage';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCurrentWarehouse } from '@/lib/hooks/useCurrentWarehouse';
import { logout } from '@/lib/services/authService';

export function AppSidebar() {
  const lang = useCurrentLanguage();
  const pathname = usePathname();
  const t = useTranslations();
  const warehouse = useCurrentWarehouse();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const ensureUniquePath = (base: string, page: string) => {
    crudSuffix.forEach((crudSuffix) => {
      if (base.includes(crudSuffix)) {
        base = base.substring(0, base.length - 7);
      }
    });

    suffixList.forEach((suffix) => {
      if (base.includes(suffix)) {
        base = base.substring(0, base.length - suffix.length);
      }
    });

    return base.slice(3) + page;
  };

  // const pathSegments = pathname.split('/');
  // const warehouseId = pathSegments[3];

  const suffixList = ['/dashboard', '/goods', '/receipt', '/issue'];

  const crudSuffix = ['/create', '/update', '/delete'];

  const warehouseItems = [
    {
      title: t('Sidebar.dashboard'),
      url: ensureUniquePath(pathname, '/dashboard'),
      icon: LayoutDashboardIcon,
    },
    {
      title: t('Sidebar.goods'),
      url: ensureUniquePath(pathname, '/goods'),
      icon: Boxes,
    },
    {
      title: t('Sidebar.import'),
      url: ensureUniquePath(pathname, '/receipt'),
      icon: PackagePlus,
    },
    {
      title: t('Sidebar.export'),
      url: ensureUniquePath(pathname, '/issue'),
      icon: PackageMinus,
    },
  ];

  const items = [
    {
      title: t('Home.home'),
      url: '/home',
      icon: Home,
    },
    {
      title: t('Sidebar.dashboard'),
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: t('Sidebar.accounts'),
      url: '/accounts',
      icon: UsersRound,
    },
    // {
    //   title: t('Sidebar.suppliers'),
    //   url: '/suppliers',
    //   icon: UsersRound,
    // },
    // {
    //   title: t('Sidebar.customers'),
    //   url: '/customers',
    //   icon: UsersRound,
    // },
    {
      title: t('Sidebar.warehouses'),
      url: '/warehouses',
      icon: Warehouse,
    },
    // {
    //   title: t('Sidebar.warehouse'),
    //   url: '/warehouse',
    //   icon: Warehouse,
    // },
    // {
    //   title: t('Sidebar.staffs'),
    //   url: '/staffs',
    //   icon: UserRoundPen,
    // },
    // {
    //   title: t('Sidebar.goods'),
    //   url: '/goods',
    //   icon: Boxes,
    // },
    {
      title: t('Sidebar.products'),
      url: '/products-home',
      icon: Boxes,
    },
    // {
    //   title: t('Sidebar.import'),
    //   url: '/receipt',
    //   icon: PackagePlus,
    // },
    // {
    //   title: t('Sidebar.export'),
    //   url: '/issue',
    //   icon: PackageMinus,
    // },
  ];

  const botItems = [
    {
      title: t('Sidebar.settings'),
      url: '/settings',
      icon: Settings,
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
      <SidebarContent
        style={{
          scrollbarColor: 'hsl(212, 18%, 20%) transparent',
        }}
      >
        {pathname.slice(3).includes('/warehouses/') ? (
          <>
            {/* Main Home Section */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className='my-2'>
                    <Link href='/home' locale={lang}>
                      <SidebarMenuButton className='flex items-center space-x-2 px-4'>
                        <Home className='size-4' />
                        <span className='text-md'>{t('Home.home')}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Warehouse Section */}
            <SidebarGroup>
              <SidebarGroupLabel className='text-white'>
                {warehouse?.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {warehouseItems.map((item, index) => {
                    const isActive = pathname.slice(3).includes(item.url);
                    return (
                      <SidebarMenuItem className='my-2' key={index}>
                        <Link href={item.url} locale={lang}>
                          <SidebarMenuButton
                            isActive={isActive}
                            className='flex items-center space-x-2 px-4 hover:bg-gray-900'
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
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => {
                  const isActive = pathname.slice(3).includes(item.url);
                  return (
                    <SidebarMenuItem className='my-2' key={index}>
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
        )}
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
            <SidebarMenuItem className='my-2'>
              <div onClick={handleLogout}>
                <SidebarMenuButton className='flex items-center space-x-2 px-4'>
                  <LogOut className='size-4' />
                  <span className='text-md'>Đăng xuất</span>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}

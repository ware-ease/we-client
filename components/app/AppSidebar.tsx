'use client';
import {
  Boxes,
  FileInput,
  Home,
  LayoutDashboardIcon,
  LogOut,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  ReceiptText,
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
import { Link, useRouter } from '@/lib/i18n/routing';
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { logout } from '@/services/authService';
import { useAuth } from '../providers/AuthProvider';

export function AppSidebar() {
  const lang = useCurrentLanguage();
  const pathname = usePathname();
  const t = useTranslations();
  const warehouse = useCurrentWarehouse();
  const { warehouseId } = useParams();
  const router = useRouter();
  const { permissions } = useAuth();

  const viewPermissions = permissions?.filter((p) => {
    const segments = p.code.split(':');
    return segments[segments.length - 1] === 'view';
  });

  const excludedUrls = ['/home'];

  const hasViewPermission = (url: string) => {
    return (
      excludedUrls.includes(url) || viewPermissions?.some((p) => p.url === url)
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Simplified ensureUniquePath using warehouseId directly
  const ensureUniquePath = (page: string) => {
    if (!warehouseId) return page; // Fallback if no warehouseId
    return `/warehouses/${warehouseId}${page}`;
  };

  const warehouseItems = [
    {
      title: 'Thông tin kho',
      url: ensureUniquePath('/'),
      icon: Warehouse,
    },
    {
      title: t('Sidebar.dashboard'),
      url: ensureUniquePath('/dashboard'),
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Hàng hóa tồn kho',
      url: ensureUniquePath('/inventories'),
      icon: Boxes,
    },
    {
      title: 'Yêu cầu',
      url: ensureUniquePath('/requests'),
      icon: FileInput,
    },
    {
      title: t('Sidebar.import'),
      url: ensureUniquePath('/receipt'),
      icon: PackagePlus,
    },
    {
      title: t('Sidebar.export'),
      url: ensureUniquePath('/issue'),
      icon: PackageMinus,
    },
    {
      title: 'Kiểm kê',
      url: ensureUniquePath('/inventory-count'),
      icon: ReceiptText,
    },
    // {
    //   title: 'Vị trí',
    //   url: ensureUniquePath('/locations'),
    //   icon: Map,
    // },
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
    {
      title: t('Sidebar.suppliers'),
      url: '/suppliers',
      icon: UsersRound,
    },
    {
      title: t('Sidebar.customers'),
      url: '/customers',
      icon: UsersRound,
    },
    {
      title: 'Yêu cầu',
      url: '/requests',
      icon: FileInput,
    },
    {
      title: t('Sidebar.warehouses'),
      url: '/warehouses',
      icon: Warehouse,
    },
    {
      title: t('Sidebar.products'),
      url: '/products-home',
      icon: Boxes,
    },
  ];

  const botItems = [
    {
      title: t('Sidebar.settings'),
      url: '/settings',
      icon: Settings,
    },
  ];

  const filteredItems = items.filter((item) => hasViewPermission(item.url));

  // Updated isWarehouseItemActive using warehouseId
  const isWarehouseItemActive = (itemUrl: string) => {
    const cleanPath = pathname.slice(3); // Remove language prefix (e.g., '/vi')
    const warehousePrefix = `/warehouses/${warehouseId}`;

    // Extract the part after the warehouse ID
    const pathAfterWarehouse = cleanPath.startsWith(warehousePrefix)
      ? cleanPath.slice(warehousePrefix.length) || '/'
      : cleanPath;

    // For root ('/'), check if it's exactly the warehouse root
    if (itemUrl === warehousePrefix + '/') {
      return pathAfterWarehouse === '/' || pathAfterWarehouse === '';
    }

    // For other URLs, check if the path after the prefix matches the item URL
    return pathAfterWarehouse === itemUrl.slice(warehousePrefix.length);
  };

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
                      <SidebarMenuButton
                        isActive={pathname.slice(3) === '/home'}
                        className='flex items-center space-x-2 px-4'
                      >
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
                  {warehouseItems.map((item, index) => (
                    <SidebarMenuItem className='my-2' key={index}>
                      <Link href={item.url} locale={lang}>
                        <SidebarMenuButton
                          isActive={isWarehouseItemActive(item.url)}
                          className='flex items-center space-x-2 px-4 hover:bg-gray-900'
                        >
                          <item.icon className='size-4' />
                          <span className='text-md'>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredItems.map((item, index) => {
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

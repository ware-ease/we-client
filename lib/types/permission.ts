export type Permission = {
  key: string;
  url: string;
};

export const samplePermissions: Permission[] = [
  { key: 'dashboard_page:view', url: '/dashboard' },
  { key: 'accounts_page:view', url: '/accounts' },
  { key: 'warehouses_page:view', url: '/warehouses' },
  { key: 'products_page:view', url: '/products' },
  { key: 'settings_page:view', url: '/settings' },
  { key: 'login_page:view', url: '/login' },
];

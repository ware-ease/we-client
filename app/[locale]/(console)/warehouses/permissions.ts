import { Permission } from '@/types/permission';

const permissions = [
  'warehouses:create',
  'warehouses:update',
  'warehouses:delete',
];

const url = '/warehouses';

export const WarehousesPermission: Permission[] = permissions.map((perm) => ({
  key: perm,
  url: url,
}));

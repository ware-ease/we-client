import { Base } from './base/base-type';
import { Permission } from './permission';
import { Warehouse } from './warehouse';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Profile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  sex: boolean;
  nationality: string;
  avatarUrl: string;
};

export type Group = {
  id: string;
  name?: string;
  permissions: any;
};

export interface Account extends Base {
  id?: string;
  username: string;
  email: string;
  profile: Profile;
  groups: Group[];
  permissions?: Permission[];
  warehouseIds?: Array<string>;
  warehouses?: Warehouse[];
  status?: number;
  updatedAt?: string;
}
export type CreateAccount = {
  id?: string;
  username: string;
  email: string;
  profile: Profile;
  groupId: string;
  permissions?: Permission[];
  warehouseIds?: Array<string>;
};

export type AccountUpdate = {
  id?: string;
  email?: string;
  profile?: Profile;
};

export type AccountStatusUpdate = {
  id: string;
  status: number;
};

export type ProfileUpdate = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  sex?: boolean;
  nationality?: string;
  avatarUrl?: string;
};

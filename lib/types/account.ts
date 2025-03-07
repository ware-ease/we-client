/* eslint-disable @typescript-eslint/no-explicit-any */
export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  sex: boolean;
  nationality: string;
  avatarUrl: string | null;
};

export type Group = {
  id: string;
  name: string;
  permissions: any;
};

export type Account = {
  id: string;
  username: string;
  email: string;
  profile?: Profile;
  groups: Group[];
  permissions: any[];
  warehouses: any[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl: string;
};

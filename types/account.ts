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
  name: string;
  permissions: any;
};

export type Account = {
  id: string;
  username: string;
  email: string;
  profile: Profile;
  groups: Group[];
  permissions: any[];
  warehouses: any[];
};

import { Base } from './base/base-type';

export interface Supplier extends Base {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  status: boolean;
}

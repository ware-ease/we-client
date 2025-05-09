import { Base } from './base/base-type';

export interface Supplier extends Base {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
}

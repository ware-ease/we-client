import { Base } from './base/base-type';

export interface Supplier extends Base {
  name: string;
  phone: string;
  status: boolean;
}

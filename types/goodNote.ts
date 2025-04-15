import { Base } from './base/base-type';
import { Batch } from './batch';
import { GoodRequest } from './goodRequest';
import { Warehouse } from './warehouse';

export interface GoodNote extends Base {
  noteType?: number;
  shipperName?: string;
  receiverName?: string;
  code?: string;
  date?: string;
  status?: number;
  goodRequestId?: string;
  goodRequestCode?: string;
  goodNoteDetails?: GoodNoteDetail[];
  requestedWarehouseId?: string;
  goodRequest?: GoodRequest;
  warehouse?: Warehouse;
  requestedWarehouse?: Warehouse;
}

export interface GoodNoteDetail extends Base {
  quantity?: number;
  note?: string;
  batch?: Batch;
  batchId?: string;
}

export interface GoodReceiveNote extends Base {
  shipperName?: string;
  receiverName?: string;
  date?: string;
  goodRequestId?: string;
  goodNoteDetails?: GoodReceiveNoteDetail[];
}

export interface GoodReceiveNoteDetail extends Base {
  quantity?: number;
  note?: string;
  newBatch?: NewBatch;
}

export interface NewBatch extends Base {
  productId?: string;
  code?: string;
  name?: string;
  inboundDate?: Date;
  mfgDate?: Date;
  expDate?: Date;
}

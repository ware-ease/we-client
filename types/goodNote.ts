import { Base } from './base/base-type';
import { Batch } from './batch';

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
}

export interface GoodNoteDetail extends Base {
  quantity?: number;
  note?: string;
  batch?: Batch;
  batchId?: string;
}

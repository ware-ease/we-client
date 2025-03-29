import { Base } from './base/base-type';
import { Batch } from './batch';

export interface GoodNote extends Base {
  noteType?: number;
  shipperName?: string;
  receiverName?: string;
  code?: string;
  date?: string;
  status?: string;
  goodRequestId?: string;
  goodRequestCode?: string;
  goodNoteDetails?: GoodNoteDetail[];
}

export interface GoodNoteDetail extends Base {
  quantity?: number;
  note?: string;
  batch?: Batch;
  batchId?: string;
}

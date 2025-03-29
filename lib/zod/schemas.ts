import { z } from 'zod';

const BaseSchema = z.object({});

export const GoodNoteDetailSchema = BaseSchema.extend({
  quantity: z.number().positive({ message: 'Chưa điền số lượng.' }),
  note: z.string().optional(),
  batchId: z.string().nonempty({ message: 'Chưa chọn lô.' }),
});

export const GoodNoteSchema = BaseSchema.extend({
  // noteType: z.number(),
  shipperName: z.string(),
  receiverName: z.string(),
  code: z.string(),
  date: z.string(),
  goodRequestId: z.string(),
  goodNoteDetails: z
    .array(GoodNoteDetailSchema)
    .nonempty({ message: 'Vui lòng thêm hàng.' }),
});

// 'use client';
// import { Inventory } from '@/types/warehouse';
// import { ColumnDef } from '@tanstack/react-table';
// import { Plus, Trash2 } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// import InventoryComboBox from '../combo-boxes/InventoryComboBox';
// import { DataTable } from '../dialogs/add-receipt/DataTable';
// import { Button } from '../shadcn-base/Button';
// import { Input } from '../shadcn-base/Input';

// interface InventoryCountAdjustmentRow {
//   id?: string;
//   inventoryId: string;
//   productId?: string;
//   productName?: string;
//   batchCode?: string;
//   unit?: string;
//   expectedQuantity?: number;
//   countedQuantity?: number;
//   difference?: number;
//   note?: string;
//   accountId?: string;
//   inventoryCountId?: string;
// }

// interface Props {
//   value: InventoryCountAdjustmentRow[];
//   onChange: (value: InventoryCountAdjustmentRow[]) => void;
//   defaultAccountId?: string; // Nếu là nhân viên kho thì truyền sẵn ID
// }

// export default function CustomInventoryCountAdjustmentTable({
//   value,
//   onChange,
//   defaultAccountId,
// }: Props) {
//   const [data, setData] = useState<InventoryCountAdjustmentRow[]>(value || []);

//   useEffect(() => {
//     onChange(data);
//   }, [data]);

//   const handleChangeRow = (
//     index: number,
//     updated: Partial<InventoryCountAdjustmentRow>
//   ) => {
//     setData((prev) =>
//       prev.map((row, i) =>
//         i === index
//           ? {
//               ...row,
//               ...updated,
//               difference:
//                 updated.countedQuantity !== undefined
//                   ? (updated.countedQuantity ?? 0) - (row.expectedQuantity ?? 0)
//                   : row.difference,
//             }
//           : row
//       )
//     );
//   };

//   const handleSelectInventory = (
//     index: number,
//     inventory: Inventory | null
//   ) => {
//     if (!inventory) return;

//     handleChangeRow(index, {
//       inventoryId: inventory.id,
//       productId: inventory.productId,
//       productName: inventory.product?.name,
//       batchCode: inventory.batchCode,
//       unit: inventory.product?.unit,
//       expectedQuantity: inventory.quantity,
//       countedQuantity: undefined,
//       difference: undefined,
//     });
//   };

//   const handleAddRow = () => {
//     setData((prev) => [
//       ...prev,
//       {
//         inventoryId: '',
//         countedQuantity: undefined,
//         note: '',
//         accountId: defaultAccountId,
//       },
//     ]);
//   };

//   const handleRemoveRow = (index: number) => {
//     setData((prev) => prev.filter((_, i) => i !== index));
//   };

//   const columns = useMemo<ColumnDef<InventoryCountAdjustmentRow>[]>(
//     () => [
//       {
//         accessorKey: 'inventoryId',
//         header: 'Hàng tồn kho',
//         cell: ({ row }) => (
//           <InventoryComboBox
//             value={row.original.inventoryId}
//             onChange={(inventory) =>
//               handleSelectInventory(row.index, inventory)
//             }
//           />
//         ),
//       },
//       {
//         accessorKey: 'productName',
//         header: 'Sản phẩm',
//         cell: ({ row }) => <span>{row.original.productName}</span>,
//       },
//       {
//         accessorKey: 'batchCode',
//         header: 'Lô',
//         cell: ({ row }) => <span>{row.original.batchCode}</span>,
//       },
//       {
//         accessorKey: 'unit',
//         header: 'ĐVT',
//         cell: ({ row }) => <span>{row.original.unit}</span>,
//       },
//       {
//         accessorKey: 'expectedQuantity',
//         header: 'Tồn kho',
//         cell: ({ row }) => <span>{row.original.expectedQuantity ?? '-'}</span>,
//       },
//       {
//         accessorKey: 'countedQuantity',
//         header: 'Thực tế',
//         cell: ({ row }) => (
//           <Input
//             type='number'
//             value={row.original.countedQuantity ?? ''}
//             onChange={(e) =>
//               handleChangeRow(row.index, {
//                 countedQuantity: Number(e.target.value),
//               })
//             }
//           />
//         ),
//       },
//       {
//         accessorKey: 'difference',
//         header: 'Chênh lệch',
//         cell: ({ row }) => {
//           const diff = row.original.difference;
//           return (
//             <span className={diff === 0 ? '' : 'text-red-500'}>
//               {diff ?? '-'}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: 'note',
//         header: 'Ghi chú',
//         cell: ({ row }) => (
//           <textarea
//             value={row.original.note ?? ''}
//             onChange={(e) =>
//               handleChangeRow(row.index, { note: e.target.value })
//             }
//           />
//         ),
//       },
//       {
//         id: 'actions',
//         header: () => null,
//         cell: ({ row }) => (
//           <Button
//             variant='ghost'
//             size='icon'
//             onClick={() => handleRemoveRow(row.index)}
//           >
//             <Trash2 className='w-4 h-4 text-red-500' />
//           </Button>
//         ),
//       },
//     ],
//     [data]
//   );

//   return (
//     <div className='space-y-4'>
//       <div className='flex justify-end'>
//         <Button variant='outline' onClick={handleAddRow}>
//           <Plus className='w-4 h-4 mr-2' />
//           Thêm dòng
//         </Button>
//       </div>
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }

const CustomInventoryCountAdjustmentTable = () => {
  return <div>CustomInventoryCountAdjustmentTable</div>;
};

export default CustomInventoryCountAdjustmentTable;

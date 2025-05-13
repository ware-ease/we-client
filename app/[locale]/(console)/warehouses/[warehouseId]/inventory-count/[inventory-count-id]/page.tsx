// 'use client';
// import { Button } from '@/components/shadcn-base/Button';
// import { Input } from '@/components/shadcn-base/Input';
// import { useAccounts } from '@/hooks/queries/accountQueries';
// import { useAddInventoryCount } from '@/hooks/queries/inventoryCountQueries';
// import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';
// import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
// import useFormData from '@/hooks/useFormData';
// import { InventoryAdjutment, InventoryCount } from '@/types/inventoryCount';
// import { useParams, usePathname, useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import { z } from 'zod';

// const InventoryAdjutmentSchema = z.object({
//   date: z.string().min(1, 'Ngày kiểm kê là bắt buộc'),
//   reason: z.string().min(1, 'Lý do kiểm kê là bắt buộc'),
//   note: z.string().optional(),
//   documentType: z.number(),
//   relatedDocument: z.string().optional(),
//   warehouseId: z.string().min(1, 'Kho là bắt buộc'),
//   inventoryCountId: z.string().min(1, 'ID kiểm kê là bắt buộc'),
// });

// type RowData = {
//   inventoryId: string | undefined;
//   countedQuantity: number;
//   note?: string;
//   errorTicketId?: string;
//   accountId: string;
// };
// interface InventoryCountAdjutmentProps {
//   inventoryCounts: InventoryCount;
// }
// const InventoryCountAdjutment = ({
//   inventoryCounts,
// }: InventoryCountAdjutmentProps) => {
//   //   const { data, setData } = useState<RowData[]>( inventoryCounts || []);
//   const { warehouseId, inventoryCountId } = useParams();
//   console.log(warehouseId); // Logs the warehouseId (e.g., '4632ec72-23ab-46d2-b285-50c50b332603')
//   console.log(inventoryCountId);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { mutate } = useAddInventoryCount();
//   const currentWarehouse = useCurrentWarehouse();

//   const { data: inventoryData, isLoading } = useWarehousesInventories(
//     true,
//     (warehouseId as string) ?? ''
//   );
//   const { data: accountsData } = useAccounts();
//   const { formData, handleChange } = useFormData<InventoryAdjutment>({
//     reason: '',
//     note: '',
//     documentType: 0,
//     relatedDocument: '',
//     warehouseId: '',
//     inventoryCountId: '',
//     date: new Date().toISOString().split('T')[0],
//   });

//   const [data, setData] = useState<RowData[]>([]);

//   const handleSubmit = () => {
//     const finalFormData: InventoryAdjutment = {
//       ...formData,
//       warehouseId: currentWarehouse?.id ?? '',
//       inventoryCount: {
//         // You need to wrap the data in an InventoryCount object
//         inventoryCountDetails: data.map((row) => ({
//           inventoryId: row.inventoryId,
//           countedQuantity: parseFloat(row.countedQuantity.toString() || '0'),
//           note: row.note,
//           errorTicketId: row.errorTicketId || undefined,
//           accountId: row.accountId,
//           productId: '', // Include productId if necessary
//           batchCode: '', // Include batchCode if relevant
//         })),
//         // Add other properties for InventoryCount if needed
//         status: 0, // Assuming this is a required field
//         date: formData.date,
//         warehouseId: currentWarehouse?.id ?? '',
//       },
//     };

//     const result = InventoryAdjutmentSchema.safeParse(finalFormData);
//     if (!result.success) {
//       result.error.errors.forEach((err) => toast.error(err.message));
//       return;
//     }

//     mutate(finalFormData, {
//       onSuccess: () => {
//         router.push(
//           pathname.replace(
//             `/vi/warehouses/${currentWarehouse?.id}/inventory-count`,
//             ''
//           )
//         );
//       },
//       onError: () => {
//         toast.error('Tạo biên bản thất bại');
//       },
//     });
//   };

//   return (
//     <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
//       <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
//         <h1 className='text-2xl font-bold text-gray-800 mb-6'>
//           Tạo biên bản điều chỉnh kiểm kê
//         </h1>

//         <div className='space-y-4'>
//           {/* Basic Info */}
//           <div className='grid grid-cols-2 gap-4'>
//             <div>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Lý do kiểm kê
//               </label>
//               <Input
//                 name='reason'
//                 value={formData.reason}
//                 onChange={handleChange}
//                 className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
//               />
//             </div>
//             <div>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Ngày kiểm kê
//               </label>
//               <Input
//                 name='date'
//                 type='date'
//                 value={formData.date}
//                 onChange={handleChange}
//                 className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
//               />
//             </div>
//             <div>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Mã phiếu kiểm kê
//               </label>
//               <Input
//                 name='inventoryCountId'
//                 value={formData.inventoryCountId}
//                 onChange={handleChange}
//                 className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
//               />
//             </div>
//             <div>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Loại tài liệu
//               </label>
//               <Input
//                 name='documentType'
//                 type='number'
//                 value={formData.documentType}
//                 onChange={handleChange}
//                 className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
//               />
//             </div>
//             <div>
//               <label className='block text-sm font-medium text-gray-700'>
//                 Ghi chú
//               </label>
//               <textarea
//                 name='note'
//                 value={formData.note}
//                 onChange={handleChange}
//                 placeholder='Điền ghi chú...'
//                 className='mt-1 w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24'
//               />
//             </div>
//             {currentWarehouse && (
//               <div>
//                 <label className='block text-sm font-medium text-gray-700'>
//                   Kho kiểm kê
//                 </label>
//                 <Input
//                   value={currentWarehouse.name}
//                   readOnly
//                   className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100'
//                 />
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           {/* <div>
//             <h2 className='text-lg font-semibold text-gray-800 mb-4'>
//               Chọn tồn kho cần điều chỉnh
//             </h2>
//             {isLoading ? (
//               <div>Đang tải danh sách tồn kho...</div>
//             ) : (
//               <CustomInventoryCheckTable
//                 inventories={inventoryData?.inventories || []}
//                 onDataChange={(newData: RowData[]) => setData(newData)}
//                 accounts={accountsData || []}
//               />
//             )}
//           </div> */}

//           {/* Submit */}
//           <div className='flex justify-end space-x-4'>
//             <Button
//               onClick={handleSubmit}
//               className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
//             >
//               Tạo biên bản điều chỉnh kiểm kê
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryCountAdjutment;

const page = () => {
  return <div>page</div>;
};

export default page;

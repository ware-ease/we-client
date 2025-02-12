// 'use client';

// import { ColumnDef } from '@tanstack/react-table';
// import { useState } from 'react';

// interface Permission {
//   page: string;
//   add: boolean;
//   update: boolean;
//   delete: boolean;
// }

// // Hàm tạm thời để xử lý sự kiện (sẽ kết nối API sau)
// const handleCheckboxChange = (
//   page: string,
//   action: string,
//   checked: boolean
// ) => {
//   console.log(`Update ${action} for ${page}:`, checked);
//   // Chỗ này sẽ dùng fetch hoặc axios để gọi API sau
// };

// export const columns: ColumnDef<Permission>[] = [
//   {
//     accessorKey: 'page',
//     header: 'Permission',
//   },
//   {
//     accessorKey: 'add',
//     header: 'Add',
//     cell: ({ row }) => {
//       const [checked, setChecked] = useState(row.getValue('add') as boolean);
//       return (
//         <input
//           type='checkbox'
//           checked={checked}
//           onChange={(e) => {
//             setChecked(e.target.checked);
//             handleCheckboxChange(
//               row.getValue('page') as string,
//               'add',
//               e.target.checked
//             );
//           }}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: 'update',
//     header: 'Update',
//     cell: ({ row }) => {
//       const [checked, setChecked] = useState(row.getValue('update') as boolean);
//       return (
//         <input
//           type='checkbox'
//           checked={checked}
//           onChange={(e) => {
//             setChecked(e.target.checked);
//             handleCheckboxChange(
//               row.getValue('page') as string,
//               'update',
//               e.target.checked
//             );
//           }}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: 'delete',
//     header: 'Delete',
//     cell: ({ row }) => {
//       const [checked, setChecked] = useState(row.getValue('delete') as boolean);
//       return (
//         <input
//           type='checkbox'
//           checked={checked}
//           onChange={(e) => {
//             setChecked(e.target.checked);
//             handleCheckboxChange(
//               row.getValue('page') as string,
//               'delete',
//               e.target.checked
//             );
//           }}
//         />
//       );
//     },
//   },
// ];

'use client';

import { ColumnDef } from '@tanstack/react-table';

export interface Permission {
  page: string;
  add: boolean;
  update: boolean;
  delete: boolean;
}

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: 'page',
    header: 'Permission',
  },
  {
    accessorKey: 'add',
    header: 'Add',
    cell: ({ row }) => (
      <input type='checkbox' checked={row.getValue('add')} readOnly />
    ),
  },
  {
    accessorKey: 'update',
    header: 'Update',
    cell: ({ row }) => (
      <input type='checkbox' checked={row.getValue('update')} readOnly />
    ),
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <input type='checkbox' checked={row.getValue('delete')} readOnly />
    ),
  },
];

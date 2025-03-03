'use client';
import { columns } from './Columns';
import { DataTable } from './DataTable';
import { useQuery } from '@tanstack/react-query';
import { getSuppliers } from '@/lib/services/supplierService';

const Suppliers = () => {
  const { data } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await getSuppliers();
      return res;
    },
  });

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            {/* <TranslatedMessage tKey='Suppliers' /> */}
            Nhà cung cấp
          </div>
          <div></div>
        </div>
        <DataTable columns={columns} data={data!} />
      </div>
    </div>
  );
};

export default Suppliers;

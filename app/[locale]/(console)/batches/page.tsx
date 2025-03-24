import BatchTable from '@/components/custom-table/batch/BatchTable';

const Batches = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Quản lý lô hàng</div>
      <BatchTable />
    </div>
  );
};

export default Batches;

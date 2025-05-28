import AccountTaskTable from '@/components/custom-table/task/InventoryCountTable';

const Tasks = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Biên bản kiểm kê
      </div>
      <AccountTaskTable />
    </div>
  );
};

export default Tasks;

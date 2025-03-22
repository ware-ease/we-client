import SupplierTable from '@/app/_components/custom-table/partner/SupplierTable';

const Suppliers = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Quản lý nhà cung cấp
      </div>
      <SupplierTable />
    </div>
  );
};

export default Suppliers;

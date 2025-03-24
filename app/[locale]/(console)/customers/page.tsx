import CustomerTable from '@/components/custom-table/partner/CustomerTable';

export default async function Customers() {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Quản lý khách hàng
      </div>
      <CustomerTable />
    </div>
  );
}

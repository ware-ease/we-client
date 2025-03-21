import AccountTable from '@/app/_components/custom-table/account/AccountTable';

export default function Accounts() {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Quản lý tài khoản
      </div>
      <AccountTable />
    </div>
  );
}

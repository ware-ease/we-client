import { Link } from '@/lib/i18n/routing';
import { FileChartLine, FileText } from 'lucide-react';
import React from 'react';

const WarehouseReport = () => {
  return (
    <main className='flex flex-col w-full max-w-7xl mx-auto px-4 py-6 space-y-10'>
      {/* Header */}
      <div className='space-y-1'>
        <h1 className='text-4xl font-bold text-primary'>Báo cáo</h1>
        <p className='text-gray-600 text-base'>Hệ thống báo cáo kho WareEase</p>
      </div>
      <section className='bg-gray-50 p-6 rounded-xl shadow-sm border space-y-4'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Các loại báo cáo
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* <CardLink
            href='/report/inventory'
            icon={<Warehouse className='text-red-500 w-6 h-6' />}
            title='Báo cáo tồn kho'
            description='Quản lý tồn kho của kho hoặc toàn hệ thống'
          /> */}
          <CardLink
            href='/report/stockcard'
            icon={<FileText className='text-orange-500 w-6 h-6' />}
            title='Thẻ kho'
            description='Quản lý thông tin nhập kho, xuất kho, tồn kho'
          />
          <CardLink
            href='/report/stockbook'
            icon={<FileChartLine className='text-blue-500 w-6 h-6' />}
            title='Báo cáo xuất nhập tồn'
            description='Quản lý xuất nhập tồn theo kỳ'
          />
          {/* <CardLink
            href='/report/adjustment'
            icon={<FileChartColumn className='text-yellow-500 w-6 h-6' />}
            title='Báo cáo kiểm hàng'
            description='Quản lý các thông tin khi kiểm kê, điều chỉnh'
          /> */}
        </div>
      </section>
    </main>
  );
};

const CardLink = ({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Link href={href} className='group'>
    <div className='h-full bg-white p-5 rounded-lg shadow hover:shadow-md transition-all flex space-x-4 items-center'>
      {icon}
      <div>
        <h3 className='font-semibold group-hover:underline'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
    </div>
  </Link>
);

export default WarehouseReport;

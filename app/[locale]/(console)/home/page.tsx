'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { Link } from '@/lib/i18n/routing';
import {
  BarChart,
  Box,
  FileChartColumn,
  FileText,
  List,
  Truck,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const { currentUser } = useAuth();
  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser?.groups) {
      const groupIds = currentUser.groups.map((group) => String(group.id));
      setUserGroups(groupIds);
    } else {
      setUserGroups([]);
    }
  }, [currentUser]);

  const isAdmin = userGroups.includes('1');
  const isWarehouseKeeper = userGroups.includes('2');
  const isWarehouseStaff = userGroups.includes('3');
  const isSale = userGroups.includes('4');

  const canSeeWarehouses = isAdmin || isWarehouseKeeper || isWarehouseStaff;
  const canSeeProducts = isAdmin || isWarehouseKeeper;
  const canSeeRequests = isAdmin || isSale;
  const canSeeDashboard = isAdmin || isWarehouseKeeper;
  const canSeeAccounts = isAdmin;
  const canSeeSuppliers = isAdmin || isSale;
  const canSeeCustomers = isAdmin || isSale;
  const canSeeReport = isAdmin || isWarehouseKeeper;

  return (
    <main className='flex flex-col w-full max-w-7xl mx-auto px-4 py-6 space-y-10'>
      {/* Header */}
      <div className='space-y-1'>
        <h1 className='text-4xl font-bold text-primary'>Trang chủ</h1>
        <p className='text-gray-600 text-base'>
          Chào mừng bạn đến với hệ thống quản lý kho WareEase!
        </p>
      </div>

      {/* Quản lý kho */}
      {(canSeeWarehouses || canSeeProducts || canSeeRequests) && (
        <section className='bg-gray-50 p-6 rounded-xl shadow-sm border space-y-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Quản lý kho</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {canSeeWarehouses && (
              <CardLink
                href='/warehouses'
                icon={<Box className='text-red-500 w-6 h-6' />}
                title='Kho hàng'
                description='Xem và quản lý các kho hàng'
              />
            )}
            {canSeeProducts && (
              <CardLink
                href='/products-home'
                icon={<List className='text-orange-500 w-6 h-6' />}
                title='Sản phẩm'
                description='Quản lý danh sách sản phẩm'
              />
            )}
            {canSeeRequests && (
              <CardLink
                href='/requests'
                icon={<FileText className='text-blue-500 w-6 h-6' />}
                title='Yêu cầu'
                description='Theo dõi các yêu cầu nhập/xuất hàng'
              />
            )}
          </div>
        </section>
      )}

      {/* Quản lý khác */}
      {(canSeeDashboard ||
        canSeeAccounts ||
        canSeeSuppliers ||
        canSeeCustomers) && (
        <section className='bg-gray-50 p-6 rounded-xl shadow-sm border space-y-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Quản lý khác</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {canSeeDashboard && (
              <CardLink
                href='/dashboard'
                icon={<BarChart className='text-purple-500 w-6 h-6' />}
                title='Bảng điều khiển'
                description='Xem tổng quan và báo cáo'
              />
            )}
            {canSeeAccounts && (
              <CardLink
                href='/accounts'
                icon={<User className='text-green-500 w-6 h-6' />}
                title='Tài khoản'
                description='Quản lý tài khoản người dùng'
              />
            )}
            {canSeeSuppliers && (
              <CardLink
                href='/suppliers'
                icon={<Truck className='text-blue-500 w-6 h-6' />}
                title='Nhà cung cấp'
                description='Quản lý danh sách nhà cung cấp'
              />
            )}
            {canSeeCustomers && (
              <CardLink
                href='/customers'
                icon={<Users className='text-orange-500 w-6 h-6' />}
                title='Khách hàng'
                description='Quản lý danh sách khách hàng'
              />
            )}
            {canSeeReport && (
              <CardLink
                href='/report'
                icon={<FileChartColumn className='text-yellow-500 w-6 h-6' />}
                title='Báo cáo'
                description='Quản lý báo cáo kho và hệ thống'
              />
            )}
          </div>
        </section>
      )}
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

export default Home;

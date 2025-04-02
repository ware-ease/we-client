'use client';

import { AreaCharts } from '@/components/dashboards/AreaChart';
import BaseCard from '@/components/dashboards/BaseCard';
import { PieCharts } from '@/components/dashboards/PieChart';
import { StockChart } from '@/components/dashboards/StockChart';
import {
  LucideDollarSign,
  LucidePackage,
  LucideShoppingCart,
  LucideUsers,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4'>
      <BaseCard
        title='Doanh thu tổng'
        amount='$45,231.89'
        percentageChange='+20.1% so với tháng trước'
        icon={LucideDollarSign}
        iconClass='text-blue-500'
      />
      <BaseCard
        title='Đơn hàng mới'
        amount='1,523'
        percentageChange='+5.2% so với tuần trước'
        icon={LucideShoppingCart}
        iconClass='text-green-500'
      />
      <BaseCard
        title='Giá trị tồn kho'
        amount='$120,450'
        percentageChange='+8.7% trong quý này'
        icon={LucidePackage}
        iconClass='text-yellow-500'
      />
      <BaseCard
        title='Tăng trưởng khách hàng'
        amount='3,450'
        percentageChange='+15.4% so với năm trước'
        icon={LucideUsers}
        iconClass='text-purple-500'
      />

      {/* Biểu đồ tồn kho */}
      <div className='col-span-4'>
        <StockChart />
      </div>

      {/* Biểu đồ khu vực */}
      <div className='col-span-2'>
        <AreaCharts />
      </div>

      {/* Biểu đồ đơn hàng */}
      <div className='col-span-2'>
        <PieCharts />
      </div>
    </div>
  );
};

export default Dashboard;

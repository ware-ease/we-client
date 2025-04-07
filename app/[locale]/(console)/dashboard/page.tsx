'use client';

import { AreaCharts } from '@/components/dashboards/AreaChart';
import BaseCard from '@/components/dashboards/BaseCard';
import { PieCharts } from '@/components/dashboards/PieChart';
import { StockChart } from '@/components/dashboards/StockChart';
import {
  LucideArrowDownToLine,
  LucideArrowRightLeft,
  LucideArrowUpFromLine,
  LucidePackage,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4'>
      {/* Tổng nhập kho trong tháng */}
      <BaseCard
        title='Tổng nhập kho trong tháng'
        amount='8,500 mặt hàng'
        percentageChange='Tăng 3% so với tháng trước'
        icon={LucideArrowDownToLine}
        iconClass='text-green-500'
      />
      {/* Tổng xuất kho trong tháng */}
      <BaseCard
        title='Tổng xuất kho trong tháng'
        amount='9,200 mặt hàng'
        percentageChange='Giảm 2% so với tháng trước'
        icon={LucideArrowUpFromLine}
        iconClass='text-yellow-500'
      />
      {/* Tổng tồn kho hiện tại */}
      <BaseCard
        title='Tổng tồn kho hiện tại'
        amount='12,300 mặt hàng'
        percentageChange='Giảm 5% so với đầu tháng'
        icon={LucidePackage}
        iconClass='text-blue-500'
      />
      {/* Tổng chuyển kho trong tháng */}
      <BaseCard
        title='Tổng chuyển kho trong tháng'
        amount='1,200 mặt hàng'
        percentageChange='Tăng 10% so với tháng trước'
        icon={LucideArrowRightLeft}
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

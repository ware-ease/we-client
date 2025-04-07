'use client';

import { AreaCharts } from '@/components/dashboards-warehouse/AreaChart';
import BaseCard from '@/components/dashboards-warehouse/BaseCard';
import { PieCharts } from '@/components/dashboards-warehouse/PieChart';
import { StockChart } from '@/components/dashboards-warehouse/StockChart';
import {
  LucideArrowDownToLine,
  LucideArrowRightLeft,
  LucideArrowUpFromLine,
  LucidePackage,
} from 'lucide-react';

const WarehouseDashboard = () => {
  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4'>
      {/* Tổng nhập kho */}
      <BaseCard
        title='Tổng nhập kho'
        amount='2,800 mặt hàng'
        percentageChange='Tăng 4% so với tháng trước'
        icon={LucideArrowDownToLine}
        iconClass='text-green-500'
      />
      {/* Tổng xuất kho */}
      <BaseCard
        title='Tổng xuất kho'
        amount='3,100 mặt hàng'
        percentageChange='Giảm 2% so với tháng trước'
        icon={LucideArrowUpFromLine}
        iconClass='text-yellow-500'
      />
      {/* Tổng tồn kho */}
      <BaseCard
        title='Tổng tồn kho'
        amount='300 mặt hàng'
        percentageChange='Giảm 3% so với đầu tháng'
        icon={LucidePackage}
        iconClass='text-blue-500'
      />
      {/* Tổng chuyển kho */}
      <BaseCard
        title='Tổng chuyển kho'
        amount='500 mặt hàng'
        percentageChange='Tăng 8% so với tháng trước'
        icon={LucideArrowRightLeft}
        iconClass='text-purple-500'
      />

      {/* Biểu đồ tồn kho */}
      <div className='col-span-4'>
        <StockChart />
      </div>

      {/* Biểu đồ nhập - xuất */}
      <div className='col-span-2'>
        <AreaCharts />
      </div>

      {/* Biểu đồ theo loại mặt hàng */}
      <div className='col-span-2'>
        <PieCharts />
      </div>
    </div>
  );
};

export default WarehouseDashboard;

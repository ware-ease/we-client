'use client';

import BaseCard from '@/components/dashboards/BaseCard';
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
        title='Total Revenue'
        amount='$45,231.89'
        percentageChange='+20.1% from last month'
        icon={LucideDollarSign}
      />
      <BaseCard
        title='New Orders'
        amount='1,523'
        percentageChange='+5.2% from last week'
        icon={LucideShoppingCart}
      />
      <BaseCard
        title='Stock Value'
        amount='$120,450'
        percentageChange='+8.7% this quarter'
        icon={LucidePackage}
      />
      <BaseCard
        title='Customer Growth'
        amount='3,450'
        percentageChange='+15.4% from last year'
        icon={LucideUsers}
      />
      {/* Biểu đồ tồn kho */}
      <div className='col-span-4'>
        <StockChart />
      </div>
    </div>
  );
};

export default Dashboard;

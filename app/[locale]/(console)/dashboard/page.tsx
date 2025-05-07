'use client';
import { AreaCharts } from '@/components/dashboards/AreaChart';
import BaseCard from '@/components/dashboards/BaseCard';
import { PieCharts } from '@/components/dashboards/PieChart';
import { StockChart } from '@/components/dashboards/StockChart';
import { getDashboardCards } from '@/services/dashboardService';
import {
  LucideArrowDownToLine,
  LucideArrowRightLeft,
  LucideArrowUpFromLine,
  LucidePackage,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [cardData, setCardData] = useState<{
    totalPutIn: number;
    changePutIn: number;
    totalTakeOut: number;
    changeTakeOut: number;
    currentStockChange: number;
    changeStock: number;
    totalTransfer: number;
    changeTransfer: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardCards();
        setCardData(response);
      } catch (error) {
        console.error('Error fetching dashboard cards:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4'>
      {/* Tổng nhập kho trong tháng */}
      <BaseCard
        title='Tổng nhập kho trong tháng'
        amount={
          cardData ? `${cardData.totalPutIn.toLocaleString()} mặt hàng` : '...'
        }
        percentageChange={
          cardData ? `Tăng ${cardData.changePutIn}% so với tháng trước` : '...'
        }
        icon={LucideArrowDownToLine}
        iconClass='text-green-500'
      />
      {/* Tổng xuất kho trong tháng */}
      <BaseCard
        title='Tổng xuất kho trong tháng'
        amount={
          cardData
            ? `${cardData.totalTakeOut.toLocaleString()} mặt hàng`
            : '...'
        }
        percentageChange={
          cardData
            ? `Tăng ${cardData.changeTakeOut}% so với tháng trước`
            : '...'
        }
        icon={LucideArrowUpFromLine}
        iconClass='text-yellow-500'
      />
      {/* Tổng tồn kho hiện tại */}
      <BaseCard
        title='Tổng tồn kho hiện tại'
        amount={
          cardData
            ? `${cardData.currentStockChange.toLocaleString()} mặt hàng`
            : '...'
        }
        percentageChange={
          cardData ? `Tăng ${cardData.changeStock}% so với đầu tháng` : '...'
        }
        icon={LucidePackage}
        iconClass='text-blue-500'
      />
      {/* Tổng chuyển kho trong tháng */}
      <BaseCard
        title='Tổng chuyển kho trong tháng'
        amount={
          cardData
            ? `${cardData.totalTransfer.toLocaleString()} mặt hàng`
            : '...'
        }
        percentageChange={
          cardData
            ? `Tăng ${cardData.changeTransfer}% so với tháng trước`
            : '...'
        }
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

'use client';

import { AreaCharts } from '@/components/dashboards-warehouse/AreaChart';
import BaseCard from '@/components/dashboards-warehouse/BaseCard';
import { PieCharts } from '@/components/dashboards-warehouse/PieChart';
import { StockChart } from '@/components/dashboards-warehouse/StockChart';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { getDashboardCards } from '@/services/dashboardService';
import {
  LucideArrowDownToLine,
  LucideArrowRightLeft,
  LucideArrowUpFromLine,
  LucidePackage,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const WarehouseDashboard = () => {
  const currentWarehouse = useCurrentWarehouse();
  const warehouseId = currentWarehouse?.id;

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
    if (!warehouseId) return;

    const fetchData = async () => {
      try {
        const response = await getDashboardCards(warehouseId);
        setCardData(response);
      } catch (error) {
        console.error('Error fetching warehouse dashboard cards:', error);
      }
    };

    console.log(cardData);
    fetchData();
  }, [warehouseId]);

  console.log(cardData);
  return (
    <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4'>
      <BaseCard
        title='Tổng nhập kho'
        amount={
          cardData ? `${cardData.totalPutIn.toLocaleString()} mặt hàng` : '...'
        }
        percentageChange={
          cardData ? `Tăng ${cardData.changePutIn}% so với tháng trước` : '...'
        }
        icon={LucideArrowDownToLine}
        iconClass='text-green-500'
      />
      <BaseCard
        title='Tổng xuất kho'
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
      <BaseCard
        title='Tổng tồn kho'
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
      <BaseCard
        title='Tổng chuyển kho'
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

      <div className='col-span-4'>
        <StockChart />
      </div>

      <div className='col-span-2'>
        <AreaCharts />
      </div>

      <div className='col-span-2'>
        <PieCharts
        //warehouseId={warehouseId}
        />
      </div>
    </div>
  );
};

export default WarehouseDashboard;

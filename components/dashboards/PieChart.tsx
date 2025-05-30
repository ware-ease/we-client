'use client';

import { useGetDashboardPieChart } from '@/hooks/queries/dashboardQueries';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';

interface WarehouseData {
  warehouse: string;
  quantity: number;
  percent: number;
}

// interface PieChartResponse {
//   status: number;
//   message: string;
//   data: {
//     totalStock: number;
//     changePercent: number;
//     warehouses: WarehouseData[];
//   };
// }

interface ChartData {
  name: string;
  value: number;
  percent: number;
}

interface PieChartProps {
  warehouseId?: string;
}

const COLORS = ['#1E3A8A', '#60A5FA', '#DBEAFE'];

export function PieCharts({ warehouseId }: PieChartProps) {
  const { data: chartResponse, isLoading } = useGetDashboardPieChart(warehouseId);

  const chartData = useMemo(() => {
    if (!chartResponse?.data?.warehouses) return [];
    return chartResponse.data.warehouses.map((item: WarehouseData): ChartData => ({
      name: item.warehouse,
      value: item.quantity,
      percent: item.percent,
    }));
  }, [chartResponse]);

  const totalStock = chartResponse?.data?.totalStock || 0;
  const changePercent = chartResponse?.data?.changePercent || 0;

  if (isLoading) {
    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-2'>
          <CardTitle>Phân bố hàng hóa theo kho</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-2'>
        <CardTitle>Phân bố hàng hóa theo kho</CardTitle>
        <CardDescription>
          Tỷ lệ phân bố hàng hóa trong các kho
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-2'>
        <div className='relative flex justify-center items-center h-[270px]'>
          <div className='absolute inset-0 flex flex-col justify-center items-center'>
            <span className='text-3xl font-bold'>{totalStock}</span>
            <span className='text-sm text-gray-500'>Tổng tồn kho</span>
          </div>
          <PieChart width={400} height={260}>
            <Pie
              data={chartData}
              cx={200}
              cy={130}
              innerRadius={70}
              outerRadius={110}
              fill='#8884d8'
              paddingAngle={2}
              dataKey='value'
              nameKey='name'
            >
              {chartData.map((entry: ChartData, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className='w-full flex flex-col gap-2'>
          {chartData.map((item: ChartData, index: number) => (
            <div key={item.name} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className='text-sm text-gray-600'>{item.name}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-sm font-medium'>{item.value}</span>
                <span className='text-sm text-gray-500'>({item.percent.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
          <div className='flex items-center justify-center gap-2 text-sm pt-1'>
            <span className='flex items-center gap-1'>
              {changePercent > 0 ? (
                <>
                  <TrendingUp className='h-4 w-4 text-green-500' />
                  <span className='text-green-600'>Tăng {changePercent}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className='h-4 w-4 text-red-500' />
                  <span className='text-red-600'>Giảm {Math.abs(changePercent)}%</span>
                </>
              )}
            </span>
            <span className='text-gray-500'>so với tháng trước</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

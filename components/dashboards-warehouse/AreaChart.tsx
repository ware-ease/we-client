'use client';

import { useGetDashboardLineChart } from '@/hooks/queries/dashboardQueries';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';

const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

interface WarehouseData {
  month: number;
  quantity: number;
}

// interface Warehouse {
//   warehouse: string;
//   data: WarehouseData[];
// }

// interface ChartResponse {
//   status: number;
//   message: string;
//   data: {
//     warehouses: Warehouse[];
//   };
// }

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

type ChartDataPoint = {
  month: string;
  quantity: number;
};

const chartConfig = {
  color: '#1E3A8A', // Xanh dương đậm
  fillColor: '#60A5FA', // Xanh dương nhạt
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <p className="mb-2 font-medium">
          {label} năm {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <div 
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: chartConfig.color }} 
          />
          <span className="text-muted-foreground">
            Tồn kho:
          </span>
          <span className="font-medium">
            {payload[0].value.toLocaleString()} mặt hàng
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface AreaChartProps {
  warehouseId: string;
}

export function AreaCharts({ warehouseId }: AreaChartProps) {
  const { data: chartResponse, isLoading } = useGetDashboardLineChart(warehouseId);

  const chartData = useMemo(() => {
    if (!chartResponse?.data?.warehouses?.[0]?.data) return [];

    // Lấy tháng hiện tại
    const currentMonth = new Date().getMonth(); // 0-11

    // Tạo mảng dữ liệu cho 5 tháng gần nhất
    const last5Months = Array.from({ length: 5 }, (_, index) => {
      const monthIndex = (currentMonth - index + 12) % 12; // Đảm bảo index luôn dương
      const month = MONTHS[monthIndex];

      // Tìm dữ liệu cho tháng này
      const monthData = chartResponse.data.warehouses[0].data.find(
        (d: WarehouseData) => d.month === monthIndex + 1
      );

      return {
        month,
        quantity: monthData?.quantity || 0,
      } as ChartDataPoint;
    }).reverse(); // Đảo ngược để hiển thị theo thứ tự tăng dần

    return last5Months;
  }, [chartResponse]);

  // Tính tỷ lệ tăng/giảm
  const inventoryChange = useMemo(() => {
    if (!chartData.length) return '0';

    // Lấy dữ liệu tháng đầu và tháng cuối
    const firstMonth = chartData[0];
    const lastMonth = chartData[chartData.length - 1];

    // Nếu tháng đầu = 0, chỉ tính % tăng nếu có tháng cuối > 0
    if (firstMonth.quantity === 0) {
      return lastMonth.quantity > 0 ? '100' : '0';
    }

    // Tính phần trăm thay đổi
    return (((lastMonth.quantity - firstMonth.quantity) / firstMonth.quantity) * 100).toFixed(1);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Số lượng hàng hóa tồn kho qua các tháng</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const warehouseName = chartResponse?.data?.warehouses?.[0]?.warehouse;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng hàng hóa tồn kho qua các tháng - {warehouseName}</CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho trong 5 tháng gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='aspect-[4/3] h-[310px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: chartConfig.color,
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
              />
              <Area
                type='monotone'
                dataKey='quantity'
                stroke={chartConfig.color}
                fill={chartConfig.fillColor}
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {parseFloat(inventoryChange) >= 0 ? (
                <>
                  <span className='text-green-600'>
                    Tồn kho tăng {inventoryChange}% trong 5 tháng gần nhất
                  </span>
                  <TrendingUp className='h-4 w-4 text-green-500' />
                </>
              ) : (
                <>
                  <span className='text-red-600'>
                    Tồn kho giảm {Math.abs(parseFloat(inventoryChange))}% trong 5 tháng gần nhất
                  </span>
                  <TrendingDown className='h-4 w-4 text-red-500' />
                </>
              )}
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Số liệu từ {chartData[0]?.month} đến {chartData[chartData.length - 1]?.month} năm {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

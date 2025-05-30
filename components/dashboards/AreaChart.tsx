'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useGetDashboardLineChart } from '@/hooks/queries/dashboardQueries';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../shadcn-base/Chart';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const chartConfig = {
  'Kho Sài Gòn': {
    label: 'Kho Sài Gòn',
    color: '#1E3A8A', // Xanh dương đậm
  },
  'Kho Tiền Giang': {
    label: 'Kho Tiền Giang',
    color: '#60A5FA', // Xanh dương nhạt
  },
  'Kho Long An': {
    label: 'Kho Long An',
    color: '#DBEAFE',
  },
} satisfies ChartConfig;

type WarehouseName = keyof typeof chartConfig;

interface WarehouseData {
  month: number;
  quantity: number;
}

interface Warehouse {
  warehouse: WarehouseName;
  data: WarehouseData[];
}

// interface ChartResponse {
//   status: number;
//   message: string;
//   data: {
//     warehouses: Warehouse[];
//   };
// }

type ChartDataPoint = {
  month: string;
} & {
  [K in WarehouseName]: number;
};

interface AreaChartProps {
  warehouseId?: string;
}

export function AreaCharts({ warehouseId }: AreaChartProps) {
  const { data: chartResponse, isLoading } = useGetDashboardLineChart(warehouseId);

  const chartData = useMemo(() => {
    if (!chartResponse?.data?.warehouses) return [];

    // Lấy tháng hiện tại
    const currentMonth = new Date().getMonth(); // 0-11

    // Tạo mảng dữ liệu cho 5 tháng gần nhất
    const last5Months = Array.from({ length: 5 }, (_, index) => {
      const monthIndex = (currentMonth - index + 12) % 12; // Đảm bảo index luôn dương
      const month = MONTHS[monthIndex];

      // Khởi tạo object với tháng và giá trị mặc định cho các kho
      const monthData: Partial<ChartDataPoint> = {
        month,
        'Kho Sài Gòn': 0,
        'Kho Tiền Giang': 0,
        'Kho Long An': 0,
      };

      // Thêm dữ liệu từ mỗi kho
      chartResponse.data.warehouses.forEach((warehouse: Warehouse) => {
        const monthlyData = warehouse.data.find(
          (d: WarehouseData) => d.month === monthIndex + 1
        );
        monthData[warehouse.warehouse] = monthlyData?.quantity || 0;
      });

      return monthData as ChartDataPoint;
    }).reverse(); // Đảo ngược để hiển thị theo thứ tự tăng dần

    return last5Months;
  }, [chartResponse]);

  // Tính tổng tồn kho đầu kỳ và cuối kỳ để tính tỷ lệ tăng/giảm
  const totalInventoryChange = useMemo(() => {
    if (!chartData.length) return '0';

    // Lấy dữ liệu tháng đầu và tháng cuối
    const firstMonth = chartData[0];
    const lastMonth = chartData[chartData.length - 1];

    // Tính tổng tồn kho của tất cả các kho trong tháng đầu và tháng cuối
    const startTotal = chartResponse?.data?.warehouses.reduce((sum: number, warehouse: Warehouse) => {
      const value = firstMonth[warehouse.warehouse] || 0;
      return sum + value;
    }, 0) || 0;

    const endTotal = chartResponse?.data?.warehouses.reduce((sum: number, warehouse: Warehouse) => {
      const value = lastMonth[warehouse.warehouse] || 0;
      return sum + value;
    }, 0) || 0;

    // Nếu startTotal = 0, chỉ tính % tăng nếu có endTotal > 0
    if (startTotal === 0) {
      return endTotal > 0 ? '100' : '0';
    }

    // Tính phần trăm thay đổi
    return (((endTotal - startTotal) / startTotal) * 100).toFixed(1);
  }, [chartData, chartResponse?.data?.warehouses]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng hàng hóa tồn kho qua các tháng</CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho của các kho trong 5 tháng gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} mặt hàng`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            {chartResponse?.data?.warehouses.map((warehouse: Warehouse) => (
              <Area
                key={warehouse.warehouse}
                dataKey={warehouse.warehouse}
                type='monotone'
                fill={chartConfig[warehouse.warehouse].color}
                fillOpacity={0.4}
                stroke={chartConfig[warehouse.warehouse].color}
                strokeWidth={2}
                stackId='a'
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {parseFloat(totalInventoryChange) >= 0 ? (
                <span className='text-green-600'>
                  Tồn kho tăng {totalInventoryChange}% trong 5 tháng gần nhất
                </span>
              ) : (
                <span className='text-red-600'>
                  Tồn kho giảm {Math.abs(parseFloat(totalInventoryChange))}% trong 5 tháng gần nhất
                </span>
              )}
              {parseFloat(totalInventoryChange) >= 0 ? (
                <TrendingUp className='h-4 w-4 text-green-500' />
              ) : (
                <TrendingDown className='h-4 w-4 text-red-500' />
              )}
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Số liệu {chartData[0]?.month.slice(0, 3)} - {chartData[chartData.length - 1]?.month.slice(0, 3)} năm {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

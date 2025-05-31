'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useGetDashboardLineChart } from '@/hooks/queries/dashboardQueries';
import { useWarehouses } from '@/hooks/queries/warehouseQueries';
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

interface Warehouse {
  warehouse: string;
  data: WarehouseData[];
}

type ChartDataPoint = {
  month: string;
  [key: string]: string | number; // Allow both string and number values
};

interface AreaChartProps {
  warehouseId?: string;
}

export function AreaCharts({ warehouseId }: AreaChartProps) {
  const { data: warehouses } = useWarehouses();
  const { data: chartResponse, isLoading } =
    useGetDashboardLineChart(warehouseId);

  // Create dynamic chart config from warehouses
  const chartConfig = useMemo(() => {
    if (!warehouses) return {};

    // Bảng màu với nhiều tone xanh dương được tối ưu cho khả năng phân biệt
    const blueColors = [
      '#0A2472', // Navy Blue - Màu chủ đạo
      '#1E40AF', // Royal Blue
      '#2563EB', // Bright Blue
      '#3B82F6', // Medium Blue
      '#60A5FA', // Light Blue
      '#2B4C76', // Steel Blue
      '#1D4ED8', // Strong Blue
      '#4A90E2', // Sky Blue
      '#0F52BA', // Sapphire Blue
      '#000080', // Classic Navy
      '#4169E1', // Royal Light Blue
      '#27408B', // Royal Dark Blue
      '#0066CC', // True Blue
      '#003366', // Dark Navy
      '#5D8AA8', // Light Steel Blue
    ].sort((a, b) => {
      // Sắp xếp màu theo độ sáng để tạo gradient tự nhiên hơn
      const getBrightness = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      };
      return getBrightness(b) - getBrightness(a);
    });

    // Tạo gradient màu cho mỗi kho
    return warehouses.reduce((acc, warehouse, index) => {
      acc[warehouse.name] = {
        label: warehouse.name,
        color: blueColors[index % blueColors.length],
      };
      return acc;
    }, {} as ChartConfig);
  }, [warehouses]);

  const chartData = useMemo(() => {
    if (!chartResponse?.data?.warehouses || !warehouses) return [];

    // Lấy tháng hiện tại
    const currentMonth = new Date().getMonth(); // 0-11

    // Tạo mảng dữ liệu cho 5 tháng gần nhất
    const last5Months = Array.from({ length: 5 }, (_, index) => {
      const monthIndex = (currentMonth - index + 12) % 12; // Đảm bảo index luôn dương
      const month = MONTHS[monthIndex];

      // Khởi tạo object với tháng và giá trị mặc định cho các kho
      const monthData: Partial<ChartDataPoint> = {
        month,
        ...warehouses.reduce((acc, w) => ({ ...acc, [w.name]: 0 }), {}),
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
  }, [chartResponse, warehouses]);

  // Tính tổng tồn kho đầu kỳ và cuối kỳ để tính tỷ lệ tăng/giảm
  const totalInventoryChange = useMemo(() => {
    if (!chartData.length) return '0';

    // Lấy dữ liệu tháng đầu và tháng cuối
    const firstMonth = chartData[0];
    const lastMonth = chartData[chartData.length - 1];

    // Tính tổng tồn kho của tất cả các kho trong tháng đầu và tháng cuối
    const startTotal =
      chartResponse?.data?.warehouses.reduce(
        (sum: number, warehouse: Warehouse) => {
          const value = Number(firstMonth[warehouse.warehouse]) || 0;
          return sum + value;
        },
        0
      ) || 0;

    const endTotal =
      chartResponse?.data?.warehouses.reduce(
        (sum: number, warehouse: Warehouse) => {
          const value = Number(lastMonth[warehouse.warehouse]) || 0;
          return sum + value;
        },
        0
      ) || 0;

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
          className='aspect-auto h-[270px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={true}
              horizontal={true}
              strokeDasharray='3 3'
              stroke='#E2E8F0'
              opacity={0.4}
            />
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
              tickFormatter={(value) => `${value.toLocaleString()} mặt hàng`}
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
                fill={chartConfig[warehouse.warehouse]?.color ?? ''}
                fillOpacity={0.4}
                stroke={chartConfig[warehouse.warehouse]?.color ?? ''}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>

        <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-full'
                style={{ backgroundColor: config.color }}
              />
              <span className='text-sm text-muted-foreground truncate'>
                {config.label}
              </span>
            </div>
          ))}
        </div>
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
                  Tồn kho giảm {Math.abs(parseFloat(totalInventoryChange))}%
                  trong 5 tháng gần nhất
                </span>
              )}
              {parseFloat(totalInventoryChange) >= 0 ? (
                <TrendingUp className='h-4 w-4 text-green-500' />
              ) : (
                <TrendingDown className='h-4 w-4 text-red-500' />
              )}
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Số liệu từ {chartData[0]?.month} đến{' '}
              {chartData[chartData.length - 1]?.month} năm{' '}
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useGetDashboardHistogram } from '@/hooks/queries/dashboardQueries';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';

interface DailyRecord {
  date: string;
  putIn: number;
  takeOut: number;
}

interface WarehouseData {
  warehouseName: string;
  totalPutIn: number;
  totalTakeOut: number;
  dailyRecords: DailyRecord[];
}

interface HistogramResponse {
  status: number;
  message: string;
  data: WarehouseData[];
}

const chartConfig = {
  exported: {
    label: 'Xuất kho',
    color: '#1E3A8A', // Dark blue
  },
  imported: {
    label: 'Nhập kho',
    color: '#60A5FA', // Light blue
  },
  'Kho Sài Gòn': {
    label: 'Kho Sài Gòn',
  },
  'Kho Tiền Giang': {
    label: 'Kho Tiền Giang',
  },
  'Kho Long An': {
    label: 'Kho Long An',
  },
};

const warehouseKeys = ['Kho Sài Gòn', 'Kho Tiền Giang', 'Kho Long An'] as const;
type WarehouseKey = (typeof warehouseKeys)[number];

export function StockCharts() {
  const [activeChart, setActiveChart] = useState<WarehouseKey>('Kho Sài Gòn');
  const { data: chartResponse, isLoading } = useGetDashboardHistogram();

  const total = useMemo(() => {
    if (!chartResponse?.data) return {};
    return chartResponse.data.reduce((acc: Record<string, { exported: number; imported: number }>, warehouse: WarehouseData) => {
      acc[warehouse.warehouseName] = {
        exported: warehouse.totalTakeOut,
        imported: warehouse.totalPutIn,
      };
      return acc;
    }, {});
  }, [chartResponse]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
            <CardTitle>Đang tải dữ liệu...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const activeWarehouse = chartResponse?.data?.find((w: WarehouseData) => w.warehouseName === activeChart);
  const chartData = activeWarehouse?.dailyRecords.map((record: DailyRecord) => ({
    date: record.date,
    exported: record.takeOut,
    imported: record.putIn,
  })) || [];

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>
            Số lượng hàng hóa xuất/nhập kho theo ngày -{' '}
            {chartConfig[activeChart].label}
          </CardTitle>
          <CardDescription>
            Hiển thị số lượng hàng hóa xuất kho và nhập kho của{' '}
            {chartConfig[activeChart].label.toLowerCase()} theo ngày trong tháng
          </CardDescription>
        </div>
        <div className='flex'>
          {warehouseKeys.map((key) => {
            const warehouseTotal = total[key] || { exported: 0, imported: 0 };
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className='data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(key)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[key].label}
                </span>
                <span className='text-base leading-none font-bold sm:text-xl'>
                  {warehouseTotal.exported.toLocaleString()} xuất /{' '}
                  {warehouseTotal.imported.toLocaleString()} nhập
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className='px-2 sm:p-6'>
        <div className='aspect-[4/3] h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
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
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.split('/')[0]}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} mặt hàng`]}
                labelFormatter={(label) => {
                  const [day, month, year] = label.split('/');
                  return `Ngày ${day} tháng ${month} năm ${year}`;
                }}
              />
              <Bar
                dataKey='exported'
                name='Xuất kho'
                fill={chartConfig.exported.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey='imported'
                name='Nhập kho'
                fill={chartConfig.imported.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

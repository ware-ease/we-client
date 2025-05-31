/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcn-base/Select';

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

// interface HistogramResponse {
//   status: number;
//   message: string;
//   data: WarehouseData[];
// }

const chartConfig = {
  exported: {
    label: 'Xuất kho',
    color: '#1E3A8A', // Dark blue
  },
  imported: {
    label: 'Nhập kho',
    color: '#60A5FA', // Light blue
  },
};

const warehouseOptions = [
  { id: 'Kho Sài Gòn', label: 'Kho Sài Gòn' },
  { id: 'Kho Tiền Giang', label: 'Kho Tiền Giang' },
  { id: 'Kho Long An', label: 'Kho Long An' },
] as const;

type WarehouseKey = (typeof warehouseOptions)[number]['id'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const [day, month, year] = label.split('/');
    return (
      <div className='rounded-lg border bg-white p-3 shadow-sm'>
        <p className='mb-2 font-medium'>
          Ngày {day} tháng {month} năm {year}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className='flex items-center justify-start gap-2 text-sm'>
            <div
              className='h-2 w-2 rounded-full'
              style={{
                backgroundColor: entry.color,
              }}
            />
            <span className='text-muted-foreground'>
              {entry.name === 'exported' ? 'Xuất kho:' : 'Nhập kho:'}
            </span>
            <span className='font-medium'>
              {entry.value.toLocaleString()} mặt hàng
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MONTHS = [
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2025 + i);

export function StockCharts() {
  const [activeWarehouseId, setActiveWarehouseId] = useState<WarehouseKey>('Kho Sài Gòn');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(2025);

  const { data: chartResponse, isLoading } = useGetDashboardHistogram(undefined, {
    month: selectedMonth,
    year: selectedYear,
  });

  const total = useMemo(() => {
    if (!chartResponse?.data) return {};
    return chartResponse.data.reduce(
      (
        acc: Record<string, { exported: number; imported: number }>,
        warehouse: WarehouseData
      ) => {
        acc[warehouse.warehouseName] = {
          exported: warehouse.totalTakeOut,
          imported: warehouse.totalPutIn,
        };
        return acc;
      },
      {}
    );
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

  const activeWarehouse = chartResponse?.data?.find(
    (w: WarehouseData) => w.warehouseName === activeWarehouseId
  );
  const chartData =
    activeWarehouse?.dailyRecords.map((record: DailyRecord) => ({
      date: record.date,
      exported: record.takeOut,
      imported: record.putIn,
    })) || [];

  const activeTotal = total[activeWarehouseId] || { exported: 0, imported: 0 };

  return (
    <Card>
      <CardHeader className='flex items-stretch space-y-0 border-b p-0'>
        <div className='flex flex-1 flex-row'>
          <div className='flex-1 flex flex-col justify-center gap-1 px-6 py-5 border-r'>
            <div className='flex items-center gap-4 mb-4'>
              <Select
                value={activeWarehouseId}
                onValueChange={(value: WarehouseKey) => setActiveWarehouseId(value)}
              >
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Chọn kho' />
                </SelectTrigger>
                <SelectContent>
                  {warehouseOptions.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className='w-[140px]'>
                  <SelectValue placeholder='Chọn tháng' />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className='w-[140px]'>
                  <SelectValue placeholder='Chọn năm' />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Năm {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CardTitle>
              Số lượng hàng hóa xuất/nhập kho theo ngày - {activeWarehouseId}
            </CardTitle>
            <CardDescription>
              Hiển thị số lượng hàng hóa xuất kho và nhập kho theo ngày trong tháng {selectedMonth} năm {selectedYear}
            </CardDescription>
          </div>

          <div className='flex-1 flex items-center justify-center p-6'>
            <div className='flex gap-12 w-full justify-center'>
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-sm mb-2 flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: chartConfig.exported.color }} />
                  Xuất kho
                </span>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl font-bold tabular-nums'>
                    {activeTotal.exported.toLocaleString()}
                  </span>
                  <span className='text-muted-foreground'>mặt hàng</span>
                </div>
              </div>

              <div className='flex flex-col border-l pl-12'>
                <span className='text-muted-foreground text-sm mb-2 flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: chartConfig.imported.color }} />
                  Nhập kho
                </span>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl font-bold tabular-nums'>
                    {activeTotal.imported.toLocaleString()}
                  </span>
                  <span className='text-muted-foreground'>mặt hàng</span>
                </div>
              </div>
            </div>
          </div>
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
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey='exported'
                name='exported'
                fill={chartConfig.exported.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey='imported'
                name='imported'
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

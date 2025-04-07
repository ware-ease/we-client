'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../shadcn-base/Chart';

export const description =
  'A bar chart showing export and import quantities per day for a specific warehouse';

const chartData = [
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
  {
    date: '2024-04-01',
    khoA: { exported: 160, imported: 90 },
    khoB: { exported: 130, imported: 70 },
    khoC: { exported: 110, imported: 60 },
  },
];

const chartConfig = {
  exported: {
    label: 'Xuất kho',
    color: '#1E3A8A', // Dark blue
  },
  imported: {
    label: 'Nhập kho',
    color: '#60A5FA', // Light blue
  },
  khoA: {
    label: 'Kho A',
  },
  khoB: {
    label: 'Kho B',
  },
  khoC: {
    label: 'Kho C',
  },
} satisfies ChartConfig;

const warehouseKeys = ['khoA', 'khoB', 'khoC'] as const;
type WarehouseKey = (typeof warehouseKeys)[number]; // 'khoA' | 'khoB' | 'khoC'

export function StockChart() {
  const [activeChart, setActiveChart] = React.useState<WarehouseKey>('khoA');

  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, data) => {
        acc.khoA.exported += data.khoA.exported;
        acc.khoA.imported += data.khoA.imported;
        acc.khoB.exported += data.khoB.exported;
        acc.khoB.imported += data.khoB.imported;
        acc.khoC.exported += data.khoC.exported;
        acc.khoC.imported += data.khoC.imported;
        return acc;
      },
      {
        khoA: { exported: 0, imported: 0 },
        khoB: { exported: 0, imported: 0 },
        khoC: { exported: 0, imported: 0 },
      }
    );
  }, []);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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
            const chartTotal = total[key];
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
                  {chartTotal.exported.toLocaleString()} xuất /{' '}
                  {chartTotal.imported.toLocaleString()} nhập
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[300px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData.map((data) => ({
              date: data.date,
              exported: data[activeChart].exported,
              imported: data[activeChart].imported,
            }))}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('vi-VN', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} mặt hàng`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey='exported'
              fill={chartConfig.exported.color}
              name='Xuất kho'
            />
            <Bar
              dataKey='imported'
              fill={chartConfig.imported.color}
              name='Nhập kho'
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

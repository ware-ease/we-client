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
  'A bar chart showing export and import quantities per day';

const chartData = [
  { date: '2024-04-01', exported: 450, imported: 280 },
  { date: '2024-04-02', exported: 470, imported: 300 },
  { date: '2024-04-03', exported: 460, imported: 310 },
  { date: '2024-04-04', exported: 520, imported: 330 },
  { date: '2024-04-05', exported: 580, imported: 350 },
  { date: '2024-04-06', exported: 540, imported: 340 },
  { date: '2024-04-07', exported: 518, imported: 300 },
  { date: '2024-04-08', exported: 490, imported: 290 },
  { date: '2024-04-09', exported: 510, imported: 320 },
  { date: '2024-04-10', exported: 530, imported: 310 },
  { date: '2024-04-11', exported: 470, imported: 280 },
  { date: '2024-04-12', exported: 500, imported: 300 },
  { date: '2024-04-13', exported: 480, imported: 290 },
  { date: '2024-04-14', exported: 520, imported: 330 },
  { date: '2024-04-15', exported: 550, imported: 340 },
  { date: '2024-04-16', exported: 490, imported: 310 },
  { date: '2024-04-17', exported: 510, imported: 320 },
  { date: '2024-04-18', exported: 470, imported: 280 },
  { date: '2024-04-19', exported: 530, imported: 300 },
  { date: '2024-04-20', exported: 560, imported: 340 },
  { date: '2024-04-21', exported: 480, imported: 290 },
  { date: '2024-04-22', exported: 500, imported: 310 },
  { date: '2024-04-23', exported: 520, imported: 320 },
  { date: '2024-04-24', exported: 490, imported: 300 },
  { date: '2024-04-25', exported: 510, imported: 310 },
  { date: '2024-04-26', exported: 540, imported: 330 },
  { date: '2024-04-27', exported: 470, imported: 280 },
  { date: '2024-04-28', exported: 500, imported: 300 },
  { date: '2024-04-29', exported: 520, imported: 320 },
  { date: '2024-04-30', exported: 550, imported: 340 },
  { date: '2024-04-26', exported: 540, imported: 330 },
  { date: '2024-04-27', exported: 470, imported: 280 },
  { date: '2024-04-28', exported: 500, imported: 300 },
  { date: '2024-04-29', exported: 520, imported: 320 },
  { date: '2024-04-30', exported: 550, imported: 340 },
  { date: '2024-04-26', exported: 540, imported: 330 },
  { date: '2024-04-27', exported: 470, imported: 280 },
  { date: '2024-04-28', exported: 500, imported: 300 },
  { date: '2024-04-29', exported: 520, imported: 320 },
  { date: '2024-04-30', exported: 550, imported: 340 },
];

const chartConfig = {
  exported: {
    label: 'Xuất kho',
    color: '#1E3A8A', // Xanh dương đậm (navy blue)
  },
  imported: {
    label: 'Nhập kho',
    color: '#60A5FA', // Xanh dương nhạt (blue-400)
  },
} satisfies ChartConfig;

export function StockChart() {
  const total = React.useMemo(
    () => ({
      exported: chartData.reduce((acc, curr) => acc + curr.exported, 0),
      imported: chartData.reduce((acc, curr) => acc + curr.imported, 0),
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Số lượng hàng hóa xuất/nhập kho theo ngày</CardTitle>
          <CardDescription>
            Hiển thị số lượng hàng hóa xuất kho và nhập kho theo ngày trong
            tháng
          </CardDescription>
        </div>
        <div className='flex'>
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <div
                key={chart}
                className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()} mặt hàng
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
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

'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
  { date: '2024-04-01', electronics: 500, fashion: 320, groceries: 450 },
  { date: '2024-04-02', electronics: 470, fashion: 300, groceries: 420 },
  { date: '2024-04-03', electronics: 460, fashion: 310, groceries: 430 },
  { date: '2024-04-04', electronics: 520, fashion: 330, groceries: 470 },
  { date: '2024-04-05', electronics: 580, fashion: 350, groceries: 490 },
  { date: '2024-04-06', electronics: 540, fashion: 340, groceries: 460 },
  { date: '2024-04-07', electronics: 510, fashion: 320, groceries: 430 },
];

const chartConfig = {
  electronics: {
    label: 'Điện tử',
    color: '#4F46E5', // Xanh dương đậm
  },
  fashion: {
    label: 'Thời trang',
    color: '#F59E0B', // Cam
  },
  groceries: {
    label: 'Hàng tạp hóa',
    color: '#10B981', // Xanh lá cây
  },
} satisfies ChartConfig;

export function StockChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('electronics');

  const total = React.useMemo(
    () => ({
      electronics: chartData.reduce((acc, curr) => acc + curr.electronics, 0),
      fashion: chartData.reduce((acc, curr) => acc + curr.fashion, 0),
      groceries: chartData.reduce((acc, curr) => acc + curr.groceries, 0),
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
          <CardTitle>Biểu đồ tồn kho</CardTitle>
          <CardDescription>
            Hiển thị lượng tồn kho của các nhóm sản phẩm theo thời gian
          </CardDescription>
        </div>
        <div className='flex'>
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='stock'
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
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

const chartData = [
  { month: 'January', kho1: 186, kho2: 80 },
  { month: 'February', kho1: 305, kho2: 200 },
  { month: 'March', kho1: 237, kho2: 120 },
  { month: 'April', kho1: 73, kho2: 190 },
  { month: 'May', kho1: 209, kho2: 130 },
  { month: 'June', kho1: 214, kho2: 140 },
];

const chartConfig = {
  kho1: {
    label: 'Kho 1',
    color: '#4F46E5',
  },
  kho2: {
    label: 'Kho 2',
    color: '#F59E0B',
  },
} satisfies ChartConfig;

export function AreaCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ khu vực - Đơn hàng theo kho</CardTitle>
        <CardDescription>
          Hiển thị số đơn hàng của các kho trong 6 tháng qua
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='kho2'
              type='monotone'
              fill={chartConfig.kho2.color}
              fillOpacity={0.4}
              stroke={chartConfig.kho2.color}
              strokeWidth={2}
              stackId='a'
            />
            <Area
              dataKey='kho1'
              type='monotone'
              fill={chartConfig.kho1.color}
              fillOpacity={0.4}
              stroke={chartConfig.kho1.color}
              strokeWidth={2}
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Tăng 5.2% trong tháng này <TrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Số liệu từ tháng 1 - tháng 6 năm 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

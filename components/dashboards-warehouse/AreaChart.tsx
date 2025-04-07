'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

// Sample data for Kho A
const chartData = [
  { month: 'Tháng 1', inventory: 400 },
  { month: 'Tháng 2', inventory: 380 },
  { month: 'Tháng 3', inventory: 410 },
  { month: 'Tháng 4', inventory: 390 },
  { month: 'Tháng 5', inventory: 420 },
  { month: 'Tháng 6', inventory: 408 },
];

const chartConfig = {
  inventory: {
    label: 'Tồn kho',
    color: '#4F46E5', // Indigo color
  },
} satisfies ChartConfig;

const warehouseName = 'Kho A'; // You can make this dynamic if needed

export function AreaCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Số lượng hàng hóa tồn kho qua các tháng - {warehouseName}
        </CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho của {warehouseName.toLowerCase()}{' '}
          qua các tháng trong năm
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
            <Area
              dataKey='inventory'
              type='monotone'
              fill={chartConfig.inventory.color}
              fillOpacity={0.4}
              stroke={chartConfig.inventory.color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Tăng 2% trong 6 tháng đầu năm 2024{' '}
              <TrendingUp className='h-4 w-4' />
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

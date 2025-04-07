'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import React from 'react';
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
  { month: 'January', khoA: 472, khoB: 413, khoC: 315 }, // Tổng: 1,200
  { month: 'February', khoA: 453, khoB: 396, khoC: 301 }, // Tổng: 1,150
  { month: 'March', khoA: 512, khoB: 447, khoC: 341 }, // Tổng: 1,300
  { month: 'April', khoA: 433, khoB: 378, khoC: 289 }, // Tổng: 1,100
  { month: 'May', khoA: 413, khoB: 361, khoC: 276 }, // Tổng: 1,050
  { month: 'June', khoA: 472, khoB: 413, khoC: 315 }, // Tổng: 1,200
];

const chartConfig = {
  khoA: {
    label: 'Kho A',
    color: '#1E3A8A', // Xanh dương đậm
  },
  khoB: {
    label: 'Kho B',
    color: '#60A5FA', // Xanh dương nhạt
  },
  khoC: {
    label: 'Kho C',
    color: '#DBEAFE',
  },
} satisfies ChartConfig;

export function AreaCharts() {
  // Tính tổng tồn kho đầu kỳ (Tháng 1) và cuối kỳ (Tháng 6) để tính tỷ lệ tăng/giảm
  const totalInventoryChange = React.useMemo(() => {
    const startTotal =
      chartData[0].khoA + chartData[0].khoB + chartData[0].khoC; // Tháng 1
    const endTotal =
      chartData[chartData.length - 1].khoA +
      chartData[chartData.length - 1].khoB +
      chartData[chartData.length - 1].khoC; // Tháng 6
    return (((endTotal - startTotal) / startTotal) * 100).toFixed(1); // Tỷ lệ tăng/giảm (%)
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng hàng hóa tồn kho qua các tháng</CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho của các kho trong 6 tháng qua
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
            <Area
              dataKey='khoC'
              type='monotone'
              fill={chartConfig.khoC.color}
              fillOpacity={0.4}
              stroke={chartConfig.khoC.color}
              strokeWidth={2}
              stackId='a'
            />
            <Area
              dataKey='khoB'
              type='monotone'
              fill={chartConfig.khoB.color}
              fillOpacity={0.4}
              stroke={chartConfig.khoB.color}
              strokeWidth={2}
              stackId='a'
            />
            <Area
              dataKey='khoA'
              type='monotone'
              fill={chartConfig.khoA.color}
              fillOpacity={0.4}
              stroke={chartConfig.khoA.color}
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
              {parseFloat(totalInventoryChange) >= 0
                ? `Tồn kho tăng ${totalInventoryChange}% trong 6 tháng đầu năm 2024`
                : `Tồn kho giảm ${Math.abs(
                    parseFloat(totalInventoryChange)
                  )}% trong 6 tháng đầu năm 2024`}
              {parseFloat(totalInventoryChange) >= 0 ? (
                <TrendingUp className='h-4 w-4' />
              ) : (
                <TrendingDown className='h-4 w-4' />
              )}
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

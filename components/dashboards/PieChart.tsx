'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
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
  { browser: 'kho1', orders: 275, fill: 'var(--color-kho1)' },
  { browser: 'kho2', orders: 200, fill: 'var(--color-kho2)' },
  { browser: 'kho3', orders: 287, fill: 'var(--color-kho3)' },
];

const chartConfig = {
  orders: {
    label: 'Đơn hàng',
  },
  kho1: {
    label: 'Kho 1',
    color: 'hsl(var(--chart-1))',
  },
  kho2: {
    label: 'Kho 2',
    color: 'hsl(var(--chart-2))',
  },
  kho3: {
    label: 'Kho 3',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function PieCharts() {
  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.orders, 0);
  }, []);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Biểu đồ tròn - Số đơn hàng theo kho</CardTitle>
        <CardDescription>Số liệu từ tháng 1 - tháng 6 năm 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='orders'
              nameKey='browser'
              innerRadius={50}
              strokeWidth={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Tổng đơn
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Tăng 5.2% trong tháng này <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Hiển thị tổng số đơn hàng của các kho trong 6 tháng qua
        </div>
      </CardFooter>
    </Card>
  );
}

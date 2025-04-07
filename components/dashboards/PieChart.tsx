'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
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
  { warehouse: 'Kho A', inventory: 300, fill: 'var(--color-khoA)' },
  { warehouse: 'Kho B', inventory: 262, fill: 'var(--color-khoB)' },
  { warehouse: 'Kho C', inventory: 200, fill: 'var(--color-khoC)' },
];

const chartConfig = {
  inventory: {
    label: 'Tồn kho',
  },
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

export function PieCharts() {
  const totalInventory = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.inventory, 0);
  }, []);

  // Giả lập tỷ lệ thay đổi tồn kho (dựa trên yêu cầu)
  const inventoryChange = -5; // Giảm 5% (có thể thay đổi nếu cần)

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Phân bố hàng hóa tồn kho theo kho</CardTitle>
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
              dataKey='inventory'
              nameKey='warehouse'
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
                          {totalInventory.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Tổng tồn kho
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
          {inventoryChange >= 0
            ? `Tổng tồn kho tăng ${inventoryChange}% trong 6 tháng đầu năm 2024`
            : `Tổng tồn kho giảm ${Math.abs(
                inventoryChange
              )}% trong 6 tháng đầu năm 2024`}
          {inventoryChange >= 0 ? (
            <TrendingUp className='h-4 w-4' />
          ) : (
            <TrendingDown className='h-4 w-4' />
          )}
        </div>
        <div className='text-muted-foreground leading-none'>
          Hiển thị tổng số hàng hóa tồn kho của các kho trong 6 tháng qua
        </div>
      </CardFooter>
    </Card>
  );
}

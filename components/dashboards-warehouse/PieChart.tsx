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

// Sample data for Kho A
const chartData = [
  { category: 'electronics', items: 120, fill: 'var(--color-electronics)' },
  { category: 'clothing', items: 105, fill: 'var(--color-clothing)' },
  { category: 'food', items: 75, fill: 'var(--color-food)' },
];

const chartConfig = {
  items: {
    label: 'Mặt hàng',
  },
  electronics: {
    label: 'Điện tử',
    color: 'hsl(var(--chart-1))',
  },
  clothing: {
    label: 'May mặc',
    color: 'hsl(var(--chart-2))',
  },
  food: {
    label: 'Thực phẩm',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const warehouseName = 'Kho A'; // You can make this dynamic if needed

export function PieCharts() {
  const totalItems = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.items, 0);
  }, []);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          Phân bố hàng hóa tồn kho theo danh mục - {warehouseName}
        </CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho của {warehouseName.toLowerCase()},
          phân theo danh mục sản phẩm
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) =>
                    `${value} mặt hàng (${(
                      (Number(value) / totalItems) *
                      100
                    ).toFixed(1)}%)`
                  }
                />
              }
            />
            <Pie
              data={chartData}
              dataKey='items'
              nameKey='category'
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
                          {totalItems.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Tổng mặt hàng
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
          Tổng tồn kho tăng 2% trong 6 tháng đầu năm 2024{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Hiển thị tỷ lệ phân bố hàng hóa tồn kho theo danh mục trong 6 tháng
          qua
        </div>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useGetDashboardPieChart } from '@/hooks/queries/dashboardQueries';
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

interface CategoryData {
  category: string;
  quantity: number;
  percent: number;
}

const generateBlueShades = (count: number): string[] => {
  // Tạo các màu sắc từ xanh đậm đến xanh nhạt
  const colors = [
    '#1E3A8A', 
    '#2C51B2', 
    '#3C6DD6', 
    '#4F88F0', 
    '#73A5F6', 
    '#9BC4FB', 
    '#C2DEFD', 
    '#E6F2FF', 
  ];
  
  // Nếu có nhiều danh mục hơn số màu có sẵn, tự động tạo thêm màu
  if (count > colors.length) {
    const baseColor = '#1E3A8A'; // Màu xanh đậm cơ bản
    for (let i = colors.length; i < count; i++) {
      const opacity = 1 - (i - colors.length) * 0.1;
      colors.push(`${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    }
  }

  return colors;
};

const generateChartConfig = (categories: CategoryData[]) => {
  const colors = generateBlueShades(categories.length);

  const config: Record<string, { label: string; color: string }> = {
    items: {
      label: 'Mặt hàng',
      color: 'transparent',
    },
  };

  categories.forEach((item, index) => {
    config[item.category] = {
      label: item.category,
      color: colors[index],
    };
  });

  return config as ChartConfig;
};

interface PieChartProps {
  warehouseId: string;
}

export function PieCharts({ warehouseId }: PieChartProps) {
  const { data: chartResponse, isLoading } = useGetDashboardPieChart(warehouseId);

  const chartData = React.useMemo(() => {
    if (!chartResponse?.data?.category) return [];
    return chartResponse.data.category.map((item: CategoryData) => ({
      category: item.category,
      items: item.quantity,
      fill: generateChartConfig(chartResponse.data.category)[item.category].color,
    }));
  }, [chartResponse]);

  const chartConfig = React.useMemo(() => {
    if (!chartResponse?.data?.category) return { items: { label: 'Mặt hàng', color: 'transparent' } };
    return generateChartConfig(chartResponse.data.category);
  }, [chartResponse]);

  if (isLoading) {
    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Phân bố hàng hóa tồn kho theo danh mục</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!chartResponse?.data) {
    return null;
  }

  const { totalStock, changePercent, message } = chartResponse.data;

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          Phân bố hàng hóa tồn kho theo danh mục
        </CardTitle>
        <CardDescription>
          Hiển thị số lượng hàng hóa tồn kho phân theo danh mục sản phẩm
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
                  formatter={(value, name) => {
                    const category = chartResponse.data.category.find(
                      (c: CategoryData) => c.category === name
                    );
                    return [
                      `${category?.category}: `, 
                      `${Number(value).toLocaleString()} mặt hàng (${category?.percent.toFixed(1)}%)`
                    ];
                  }}
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
                          {totalStock.toLocaleString()}
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
          {message}{' '}
          {changePercent >= 0 ? (
            <TrendingUp className='h-4 w-4 text-green-500' />
          ) : (
            <TrendingDown className='h-4 w-4 text-red-500' />
          )}
        </div>
        <div className='text-muted-foreground leading-none'>
          Hiển thị tỷ lệ phân bố hàng hóa tồn kho theo danh mục trong 6 tháng qua
        </div>
      </CardFooter>
    </Card>
  );
}

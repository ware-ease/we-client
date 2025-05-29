'use client';

import { getDashboardPieChart } from '@/services/dashboardService';
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

interface PieChartData {
  status: number;
  message: string;
  data: {
    warehouses: {
      warehouse: string;
      quantity: number;
    }[];
    totalStock: number;
    changePercent: number;
  };
}

const chartConfig = {
  inventory: {
    label: 'Tồn kho',
  },
  warehouse1: {
    label: 'Kho Sài Gòn',
    color: '#1E3A8A', // Xanh dương đậm
  },
  warehouse2: {
    label: 'Kho Tiền Giang',
    color: '#60A5FA', // Xanh dương nhạt
  },
  warehouse3: {
    label: 'Kho Long An',
    color: '#DBEAFE', // Xanh dương rất nhạt
  },
} satisfies ChartConfig;

// Add CSS variables for warehouse colors
if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--color-warehouse-1', '#1E3A8A');
  document.documentElement.style.setProperty('--color-warehouse-2', '#60A5FA');
  document.documentElement.style.setProperty('--color-warehouse-3', '#DBEAFE');
}

export function PieCharts() {
  const [chartData, setChartData] = React.useState<PieChartData['data'] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardPieChart();
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !chartData) {
    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>Phân bố hàng hóa tồn kho theo kho</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pieData = chartData.warehouses.map((item, index) => ({
    warehouse: item.warehouse,
    inventory: Math.max(0, item.quantity), // Ensure non-negative values for visualization
    fill: `var(--color-warehouse-${index + 1})`,
  }));

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
              data={pieData}
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
                          {chartData.totalStock.toLocaleString()}
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
          {chartData.changePercent >= 0
            ? `Tổng tồn kho tăng ${chartData.changePercent}% trong 6 tháng đầu năm 2024`
            : `Tổng tồn kho giảm ${Math.abs(
                chartData.changePercent
              )}% trong 6 tháng đầu năm 2024`}
          {chartData.changePercent >= 0 ? (
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

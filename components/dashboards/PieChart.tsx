'use client';

import { useGetDashboardPieChart } from '@/hooks/queries/dashboardQueries';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../shadcn-base/Card';

interface WarehouseData {
  warehouse: string;
  quantity: number;
  percent: number;
}

// interface PieChartResponse {
//   status: number;
//   message: string;
//   data: {
//     totalStock: number;
//     changePercent: number;
//     warehouses: WarehouseData[];
//   };
// }

// Bảng màu với nhiều tone xanh dương được tối ưu cho biểu đồ tròn
const COLORS = [
  '#0A2472', // Navy Blue - Màu chủ đạo
  '#2563EB', // Bright Blue
  '#60A5FA', // Light Blue
  '#1D4ED8', // Strong Blue
  '#4A90E2', // Sky Blue
  '#0F52BA', // Sapphire Blue
  '#4169E1', // Royal Light Blue
  '#27408B', // Royal Dark Blue
  '#0066CC', // True Blue
  '#5D8AA8', // Light Steel Blue
].sort((a, b) => {
  // Sắp xếp màu theo độ sáng để tạo gradient tự nhiên hơn
  const getBrightness = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  return getBrightness(b) - getBrightness(a);
});

interface ChartData {
  name: string;
  value: number;
  percent: number;
}

// Thêm interface cho activeShape props
interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  value: number;
  name: string;
  percent: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <p className="font-medium mb-1">{data.name}</p>
        <div className="text-sm text-gray-600">
          <p>Số lượng: {data.value.toLocaleString()} mặt hàng</p>
          <p>Tỷ lệ: {data.percent.toFixed(1)}%</p>
        </div>
      </div>
    );
  }
  return null;
};

interface PieChartProps {
  warehouseId?: string;
}

export function PieCharts({ warehouseId }: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { data: chartResponse, isLoading } = useGetDashboardPieChart(warehouseId);

  const chartData = useMemo(() => {
    if (!chartResponse?.data?.warehouses) return [];
    return chartResponse.data.warehouses.map((item: WarehouseData): ChartData => ({
      name: item.warehouse,
      value: item.quantity,
      percent: item.percent,
    }));
  }, [chartResponse]);

  const totalStock = chartResponse?.data?.totalStock || 0;
  const changePercent = chartResponse?.data?.changePercent || 0;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-2'>
          <CardTitle>Phân bố hàng hóa theo kho</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-2'>
        <CardTitle>Phân bố hàng hóa theo kho</CardTitle>
        <CardDescription>
          Tỷ lệ phân bố hàng hóa trong các kho
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-2'>
        <div className='relative flex justify-center items-center h-[270px]'>
          <div className='absolute inset-0 flex flex-col justify-center items-center'>
            <span className='text-3xl font-bold'>{totalStock}</span>
            <span className='text-sm text-gray-500'>Tổng tồn kho</span>
          </div>
          <PieChart width={400} height={260}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx={200}
              cy={130}
              innerRadius={70}
              outerRadius={110}
              fill='#8884d8'
              paddingAngle={2}
              dataKey='value'
              nameKey='name'
              onMouseEnter={onPieEnter}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {chartData.map((entry: ChartData, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </div>
        <div className='w-full grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4'>
          {chartData.map((item: ChartData, index: number) => (
            <div 
              key={item.name} 
              className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                activeIndex === index ? 'bg-gray-100' : 'bg-gray-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <div
                  className='w-3 h-3 rounded-full flex-shrink-0'
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className='text-sm text-gray-600 truncate'>{item.name}</span>
              </div>
              <div className='flex items-center gap-1 flex-shrink-0'>
                <span className='text-sm font-medium'>{item.value}</span>
                <span className='text-sm text-gray-500'>({item.percent.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-center gap-2 text-sm pt-1 mt-2'>
          <span className='flex items-center gap-1'>
            {changePercent > 0 ? (
              <>
                <TrendingUp className='h-4 w-4 text-green-500' />
                <span className='text-green-600'>Tăng {changePercent}%</span>
              </>
            ) : (
              <>
                <TrendingDown className='h-4 w-4 text-red-500' />
                <span className='text-red-600'>Giảm {Math.abs(changePercent)}%</span>
              </>
            )}
          </span>
          <span className='text-gray-500'>so với tháng trước</span>
        </div>
      </CardContent>
    </Card>
  );
}

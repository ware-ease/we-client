'use client';

import { Card } from '@/components/shadcn-base/Card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { Link } from '@/lib/i18n/routing';
import {
  CalendarDays,
  Eye,
  LandPlot,
  MapPin,
  Phone,
  Warehouse,
} from 'lucide-react';
import React from 'react';

interface WarehouseCardProps {
  idPath: string;
  name: string;
  address: string;
  area: string;
  operatedFrom: string;
  phone: string;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({
  idPath,
  name,
  address,
  area,
  operatedFrom,
  phone,
}) => {
  return (
    <Card className='p-4 flex flex-col gap-3 rounded-xl border hover:shadow-md transition'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Warehouse className='text-blue-600' size={28} />
          <h2 className='text-base font-semibold text-gray-800'>{name}</h2>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={idPath}>
              <Eye
                className='text-blue-500 hover:scale-105 transition cursor-pointer'
                size={20}
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>

      <div className='grid grid-cols-1 gap-1 text-sm text-gray-600'>
        <div className='flex items-center gap-2'>
          <MapPin size={14} />
          <span>{address}</span>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarDays size={14} />
          <span>Hoạt động từ: {operatedFrom}</span>
        </div>
        <div className='flex items-center gap-2'>
          <LandPlot size={14} />
          <span>Diện tích: {area}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Phone size={14} />
          <span>SĐT: {phone}</span>
        </div>
      </div>
    </Card>
  );
};

export default WarehouseCard;

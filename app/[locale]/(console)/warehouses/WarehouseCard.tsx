import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Box,
  CalendarDays,
  Edit,
  LandPlot,
  MapPin,
  SquareLibrary,
  Trash2,
  Warehouse,
} from 'lucide-react';
import React from 'react';

const WarehouseCard = () => {
  return (
    <div className='flex border rounded-md hover:border-primary hover:cursor-pointer p-4'>
      <div className='flex px-2'>
        <Warehouse size={72} />
      </div>
      <div className='flex flex-col px-4 w-full justify-center'>
        <div className='text-md text-primary font-semibold'>Kho A</div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <MapPin size={14} />
            <p>Location: Quan 1, Ho Chi Minh City</p>
          </div>
        </div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <CalendarDays size={14} />
            <p>Operated from: 20/2/2025</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col px-4 w-full justify-center'>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <LandPlot size={14} />
            <p>Area: 2000m²</p>
          </div>
        </div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <Box size={14} />
            <p>Max capacity: ~500 ton</p>
          </div>
        </div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <SquareLibrary size={14} />
            <p>Number of shelves: 100</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col px-4 w-full justify-center gap-2'>
        <Button className='text-sm bg-green-600 hover:bg-green-600 w-3/4'>
          Operating
        </Button>
        <Button className='text-sm bg-red-600 hover:bg-red-600 w-3/4'>
          Actions needed!
        </Button>
      </div>
      <div className='flex flex-col justify-between'>
        <Edit />
        <Trash2 />
      </div>
    </div>
  );
};

export default WarehouseCard;

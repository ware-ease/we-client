// import { Button } from '@/app/_components/shadcn-base/Button';
import { Link } from '@/lib/i18n/routing';
import {
  CalendarDays,
  Edit,
  LandPlot,
  MapPin,
  Trash2,
  Warehouse,
} from 'lucide-react';
import React from 'react';

interface WarehouseCardProps {
  idPath: string;
  name: string;
  address: string;
  area: string;
  operatedFrom: string;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({
  idPath,
  name,
  address,
  area,
  operatedFrom,
}) => {
  return (
    <div className='flex border rounded-md hover:border-primary p-4 hover:bg-gray-50'>
      <div className='flex px-6'>
        <Warehouse size={72} />
      </div>
      <div className='flex flex-col px-4 w-full justify-center'>
        <div className='text-md text-primary font-semibold'>{name}</div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <MapPin size={14} />
            <p>Địa chỉ: {address}</p>
          </div>
        </div>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <CalendarDays size={14} />
            <p>Hoạt động từ: {operatedFrom}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col px-4 w-full justify-center'>
        <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <LandPlot size={14} />
            <p>Diện tích: {area}</p>
          </div>
        </div>
        {/* <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <Box size={14} />
            <p>Sức chứa: khoảng {capacity}</p>
          </div>
        </div> */}
        {/* <div className='text-sm text-gray-700'>
          <div className='flex items-center space-x-1'>
            <SquareLibrary size={14} />
            <p>Number of shelves: 100</p>
          </div>
        </div> */}
      </div>
      {/* <div className='flex flex-col px-4 w-full justify-center gap-2'>
        <Button className='text-sm bg-green-600 hover:bg-green-600 w-3/4'>
          Operating
        </Button>
        <Button className='text-sm bg-red-600 hover:bg-red-600 w-3/4'>
          Actions needed!
        </Button>
      </div> */}
      <div className='flex flex-col justify-between'>
        <Link href={idPath}>
          <Edit className='hover:cursor-pointer text-yellow-400' />
        </Link>
        <Trash2 className='hover:cursor-pointer text-red-500' />
      </div>
    </div>
  );
};

export default WarehouseCard;

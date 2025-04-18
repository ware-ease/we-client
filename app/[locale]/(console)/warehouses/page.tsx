import Map from '@/components/app/Map';
import { TranslatedMessage } from '@/components/app/TranslatedMessage';
import WarehousesList from './WarehousesList';

const Warehouses = () => {
  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className=''>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Warehouses.title' />
          </div>
        </div>
        <WarehousesList />
        <div className=''>
          <Map
            className='h-[300px]'
            onLocationSelect={() => {}}
            latitude={10.76}
            longitude={106.66}
          />
        </div>
      </div>
    </div>
  );
};

export default Warehouses;

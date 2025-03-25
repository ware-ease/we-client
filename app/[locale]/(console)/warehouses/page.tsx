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
      </div>
    </div>
  );
};

export default Warehouses;

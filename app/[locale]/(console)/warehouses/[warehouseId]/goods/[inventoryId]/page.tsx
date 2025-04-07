'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/shadcn-base/Button'; // Adjust path
import { Input } from '@/components/shadcn-base/Input'; // Adjust path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog'; // Adjust path (e.g., shadcn/ui)
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn-base/Collapsible'; // Adjust path
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useInventoryById } from '@/hooks/queries/inventoryQueries'; // Assumed hook
import { useWarehouseById } from '@/hooks/queries/warehouseQueries'; // Assumed hook
// import { usePutAwayGood } from '@/hooks/mutations/goodMutations'; // Assumed hook
import { Warehouse, Inventory, Location } from '@/types/warehouse'; // Adjust path to your types

// Define InventoryLocation for quantity tracking
interface InventoryLocation {
  locationId: string;
  quantity: number;
}

const InventoryDetail: React.FC = () => {
  const { warehouseId, inventoryId } = useParams<{
    warehouseId: string;
    inventoryId: string;
  }>();

  // Fetch inventory details
  const { data: inventory, isLoading: inventoryLoading } =
    useInventoryById(inventoryId);

  // Fetch warehouse with locations
  const { data: warehouse, isLoading: warehouseLoading } =
    useWarehouseById(warehouseId);

  // Mutation to put away the good
  // const { mutate: putAwayGood, isLoading: putAwayLoading } = usePutAwayGood(
  //   warehouseId,
  //   {
  //     onSuccess: () => {
  //       alert('Hàng đã được sắp xếp thành công!');
  //     },
  //   }
  // );

  const handlePutAway = (locationId: string, quantity: number) => {
    if (!inventory || quantity <= 0) return;
    // putAwayGood({ inventoryId: inventory.id, locationId, quantity });
  };

  if (inventoryLoading || warehouseLoading) {
    return <div>Đang tải...</div>;
  }

  if (!inventory) {
    return <div>Không tìm thấy thông tin tồn kho.</div>;
  }

  if (!warehouse) {
    return <div>Không tìm thấy thông tin kho.</div>;
  }

  // Get inventory locations (assumed from API or separate hook)
  const inventoryLocations = getInventoryLocations(warehouse, inventory);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Chi tiết tồn kho</h1>

      {/* Inventory Details */}
      <div className='bg-white shadow rounded-lg p-4 mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Thông tin tồn kho</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Mã lô:</strong> {inventory.batch.code || inventory.batchId}
          </div>
          <div>
            <strong>Tổng số lượng:</strong>{' '}
            {inventory.currentQuantity.toLocaleString('vi-VN')}
          </div>
          <div>
            <strong>Kho:</strong> {warehouse.name}
          </div>
        </div>
        <div className='mt-4'>
          <strong>Vị trí hiện tại:</strong>
          {inventoryLocations.length > 0 ? (
            <ul className='list-disc ml-6'>
              {inventoryLocations.map((loc) => (
                <li key={loc.locationId}>
                  {findLocationName(warehouse.locations || [], loc.locationId)}:{' '}
                  {loc.quantity.toLocaleString('vi-VN')}
                </li>
              ))}
            </ul>
          ) : (
            ' Chưa xếp'
          )}
        </div>
      </div>

      {/* Putaway Button and Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className='bg-blue-500 text-white'>Sắp xếp hàng</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Sắp xếp hàng vào kho {warehouse.name}</DialogTitle>
          </DialogHeader>
          <LocationTree
            locations={warehouse.locations || []}
            inventory={inventory}
            inventoryLocations={inventoryLocations}
            onPutAway={handlePutAway}
            putAwayLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Get inventory locations (assumed logic)
const getInventoryLocations = (
  warehouse: Warehouse,
  inventory: Inventory
): InventoryLocation[] => {
  // Placeholder: Replace with actual hook or API call
  console.log(warehouse, inventory);
  return [
    { locationId: 'rack1', quantity: 2 },
    { locationId: 'rack2', quantity: 3 },
  ]; // Example data
};

// Helper to find location name by ID
const findLocationName = (
  locations: Location[],
  locationId: string
): string | undefined => {
  const loc = locations.find((l) => l.id === locationId);
  return loc?.name;
};

// Helper to get child locations
const getChildLocations = (
  locations: Location[],
  parentId: string | null
): Location[] => {
  return locations.filter((loc) => loc.parentId === parentId);
};

// Location Tree Component
interface LocationTreeProps {
  locations: Location[];
  inventory: Inventory;
  inventoryLocations: InventoryLocation[];
  onPutAway: (locationId: string, quantity: number) => void;
  putAwayLoading: boolean;
}

const LocationTree: React.FC<LocationTreeProps> = ({
  locations,
  inventory,
  inventoryLocations,
  onPutAway,
  putAwayLoading,
}) => {
  const rootLocations = getChildLocations(locations, null);

  return (
    <div className='text-sm max-h-[400px] overflow-y-auto'>
      {rootLocations.map((location) => (
        <LocationNode
          key={location.id}
          location={location}
          allLocations={locations}
          inventory={inventory}
          inventoryLocations={inventoryLocations}
          onPutAway={onPutAway}
          putAwayLoading={putAwayLoading}
        />
      ))}
    </div>
  );
};

// Location Node Component
interface LocationNodeProps {
  location: Location;
  allLocations: Location[];
  inventory: Inventory;
  inventoryLocations: InventoryLocation[];
  onPutAway: (locationId: string, quantity: number) => void;
  putAwayLoading: boolean;
}

const LocationNode: React.FC<LocationNodeProps> = ({
  location,
  allLocations,
  inventory,
  inventoryLocations,
  onPutAway,
  putAwayLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const childLocations = getChildLocations(allLocations, location.id);
  const isLeaf = childLocations.length === 0;
  const currentQuantity =
    inventoryLocations.find((loc) => loc.locationId === location.id)
      ?.quantity || 0;

  const handlePutAwayClick = () => {
    if (
      quantity === '' ||
      quantity <= 0 ||
      quantity > inventory.currentQuantity
    ) {
      alert(
        `Vui lòng nhập số lượng hợp lệ (tối đa ${inventory.currentQuantity}).`
      );
      return;
    }
    onPutAway(location.id, quantity);
    setQuantity('');
  };

  return (
    <div className='ml-4'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center space-x-2 py-1'>
          {childLocations.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='sm' className='p-0'>
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          <span className='flex-1'>
            {location.name} ({location.code}) - Số lượng hiện tại:{' '}
            {currentQuantity.toLocaleString('vi-VN')}
          </span>
          {isLeaf && (
            <div className='flex items-center space-x-2'>
              <Input
                type='number'
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(0, parseInt(e.target.value) || 0))
                }
                placeholder={`Tối đa ${inventory.currentQuantity}`}
                className='w-24'
                min={0}
                max={inventory.currentQuantity}
                disabled={putAwayLoading}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handlePutAwayClick}
                disabled={putAwayLoading || quantity === '' || quantity <= 0}
              >
                Sắp xếp
              </Button>
            </div>
          )}
        </div>
        {childLocations.length > 0 && (
          <CollapsibleContent>
            {childLocations.map((child) => (
              <LocationNode
                key={child.id}
                location={child}
                allLocations={allLocations}
                inventory={inventory}
                inventoryLocations={inventoryLocations}
                onPutAway={onPutAway}
                putAwayLoading={putAwayLoading}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export default InventoryDetail;

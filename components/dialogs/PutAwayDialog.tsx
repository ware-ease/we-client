'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shadcn-base/Button'; // Adjust path
import { Input } from '@/components/shadcn-base/Input'; // Adjust path
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn-base/Collapsible'; // Adjust path
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Warehouse,
  Inventory,
  Location,
  InventoryLocation,
} from '@/types/warehouse'; // Adjust path
import { usePutAwayGoods } from '@/hooks/queries/inventoryQueries';

// Define pending changes with a single quantity
interface PendingChange {
  locationId: string;
  quantity: number; // Positive for put in, negative for take out
}

interface PutawayProps {
  warehouse: Warehouse;
  inventory: Inventory;
  inventoryLocations: InventoryLocation[];
}

const Putaway: React.FC<PutawayProps> = ({
  warehouse,
  inventory,
  inventoryLocations,
}) => {
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const putAwayGoods = usePutAwayGoods();

  // Calculate unassigned quantity (total not yet put away)
  const calculateUnassignedQuantity = () => {
    const assignedTotal = inventoryLocations.reduce(
      (sum, loc) => sum + loc.quantity,
      0
    );
    const netChange = pendingChanges.reduce(
      (sum, change) => sum + change.quantity,
      0
    );
    const unassigned = inventory.currentQuantity - assignedTotal - netChange;
    return Math.max(0, unassigned);
  };

  const calculateAssignedQuantity = () => {
    const assignedTotal = inventoryLocations.reduce(
      (sum, loc) => sum + loc.quantity,
      0
    );
    console.log('Assigned Calc:', { assignedTotal });
    return Math.max(0, assignedTotal);
  };

  const handlePutAway = (locationId: string, quantity: number) => {
    if (quantity === 0) return;
    if (inventory.id === undefined) return;

    putAwayGoods.mutate({ inventoryId: inventory.id, locationId, quantity });
    setPendingChanges((prev) =>
      prev.filter((change) => change.locationId !== locationId)
    );
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6 mx-auto'>
      <h2 className='text-xl font-bold text-gray-800 mb-4'>
        Xếp hàng vào kho - Lấy hàng khỏi kho{' '}
        <span className='text-blue-600'>{warehouse.name}</span>
      </h2>
      <div className='space-y-2 mb-6'>
        <div className='text-sm text-gray-700'>
          <strong className='font-semibold'>
            Tổng số lượng chưa xếp vào kho:
          </strong>{' '}
          <span className='font-medium text-red-600'>
            {calculateUnassignedQuantity().toLocaleString('vi-VN')}
          </span>
        </div>
        <div className='text-sm text-gray-700'>
          <strong className='font-semibold'>
            Tổng số lượng đã xếp vào kho:
          </strong>{' '}
          <span className='font-medium text-green-600'>
            {calculateAssignedQuantity().toLocaleString('vi-VN')}
          </span>
        </div>
      </div>
      <LocationTree
        locations={warehouse.locations || []}
        inventory={inventory}
        inventoryLocations={inventoryLocations}
        pendingChanges={pendingChanges}
        setPendingChanges={setPendingChanges}
        onPutAway={handlePutAway}
        putAwayLoading={putAwayGoods.isPending}
      />
    </div>
  );
};

// Helper to get child locations
const getChildLocations = (
  locations: Location[],
  parentId: string | null
): Location[] => {
  return locations.filter((loc) => loc.parentId === parentId);
};

// Helper to get all descendant location IDs
const getDescendantIds = (
  locations: Location[],
  parentId: string
): string[] => {
  const children = getChildLocations(locations, parentId);
  let descendantIds = children.map((child) => child.id);
  children.forEach((child) => {
    descendantIds = descendantIds.concat(getDescendantIds(locations, child.id));
  });
  return descendantIds;
};

// Location Tree Component
interface LocationTreeProps {
  locations: Location[];
  inventory: Inventory;
  inventoryLocations: InventoryLocation[];
  pendingChanges: PendingChange[];
  setPendingChanges: React.Dispatch<React.SetStateAction<PendingChange[]>>;
  onPutAway: (locationId: string, quantity: number) => void;
  putAwayLoading: boolean;
}

const LocationTree: React.FC<LocationTreeProps> = ({
  locations,
  inventory,
  inventoryLocations,
  pendingChanges,
  setPendingChanges,
  onPutAway,
  putAwayLoading,
}) => {
  const rootLocations = getChildLocations(locations, null);

  return (
    <div className='text-sm overflow-y-auto border-t border-gray-200 pt-4'>
      {rootLocations.map((location) => (
        <LocationNode
          key={location.id}
          location={location}
          allLocations={locations}
          inventory={inventory}
          inventoryLocations={inventoryLocations}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
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
  pendingChanges: PendingChange[];
  setPendingChanges: React.Dispatch<React.SetStateAction<PendingChange[]>>;
  onPutAway: (locationId: string, quantity: number) => void;
  putAwayLoading: boolean;
}

const LocationNode: React.FC<LocationNodeProps> = ({
  location,
  allLocations,
  inventory,
  inventoryLocations,
  pendingChanges,
  setPendingChanges,
  onPutAway,
  putAwayLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const childLocations = getChildLocations(allLocations, location.id);
  const isLevel0 = location.parentId === null;

  const descendantIds = isLevel0
    ? getDescendantIds(allLocations, location.id)
    : [location.id];
  const currentQuantity = inventoryLocations
    .filter((loc) => descendantIds.includes(loc.location.id))
    .reduce((sum, loc) => sum + loc.quantity, 0);
  const pendingQuantity = pendingChanges
    .filter((change) => descendantIds.includes(change.locationId))
    .reduce((sum, change) => sum + change.quantity, 0);
  const adjustedQuantity = Math.max(0, currentQuantity + pendingQuantity);

  const pendingChange = pendingChanges.find(
    (change) => change.locationId === location.id
  ) || {
    locationId: location.id,
    quantity: 0,
  };

  const [quantity, setQuantity] = useState<number | ''>('');

  useEffect(() => {
    setQuantity(pendingChange.quantity || '');
  }, [pendingChange.quantity, location.id]);

  const unassignedQuantity = Math.max(
    0,
    inventory.currentQuantity -
      inventoryLocations.reduce((sum, loc) => sum + loc.quantity, 0) -
      pendingChanges.reduce((sum, change) => sum + change.quantity, 0)
  );

  const handleQuantityChange = (value: number) => {
    const maxPutIn =
      unassignedQuantity +
      (pendingChange.quantity > 0 ? pendingChange.quantity : 0);
    const maxTakeOut =
      adjustedQuantity +
      (pendingChange.quantity < 0 ? -pendingChange.quantity : 0);
    const adjustedValue = Math.max(-maxTakeOut, Math.min(value, maxPutIn));
    setQuantity(adjustedValue);
    setPendingChanges((prev) => {
      const existing = prev.find((change) => change.locationId === location.id);
      if (existing) {
        return prev.map((change) =>
          change.locationId === location.id
            ? { ...change, quantity: adjustedValue }
            : change
        );
      }
      return [...prev, { locationId: location.id, quantity: adjustedValue }];
    });
  };

  const handlePutAwayClick = () => {
    if (quantity === '' || quantity === 0) {
      alert('Vui lòng nhập số lượng hợp lệ (khác 0).');
      return;
    }
    onPutAway(location.id, quantity);
    setQuantity('');
  };

  return (
    <div className='py-2 border-b border-gray-100 last:border-b-0'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center space-x-2'>
          {childLocations.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='p-1 text-gray-500 hover:text-gray-700'
              >
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          <span
            className={`flex-1 text-gray-700 ${
              isLevel0 ? 'font-semibold' : ''
            }`}
          >
            {location.name} ({location.code}) -{' '}
            {isLevel0 ? 'Tổng trong khu: ' : 'Số lượng: '}{' '}
            <span className='font-medium text-gray-900'>
              {adjustedQuantity.toLocaleString('vi-VN')}
            </span>
          </span>
          {!isLevel0 && (
            <div className='flex items-center space-x-2'>
              <Input
                type='number'
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseFloat(e.target.value) || 0)
                }
                placeholder={`${-adjustedQuantity} - ${unassignedQuantity}`}
                className='w-24 h-8 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                disabled={putAwayLoading}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handlePutAwayClick}
                disabled={putAwayLoading || quantity === '' || quantity === 0}
                className='h-8 text-sm bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700'
              >
                Vào/Ra
              </Button>
            </div>
          )}
        </div>
        {childLocations.length > 0 && (
          <CollapsibleContent className='ml-6 mt-2'>
            {childLocations.map((child) => (
              <LocationNode
                key={child.id}
                location={child}
                allLocations={allLocations}
                inventory={inventory}
                inventoryLocations={inventoryLocations}
                pendingChanges={pendingChanges}
                setPendingChanges={setPendingChanges}
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

export default Putaway;

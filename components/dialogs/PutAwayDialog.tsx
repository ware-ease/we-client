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
    console.log('Unassigned Calc:', { assignedTotal, netChange, unassigned });
    return Math.max(0, unassigned);
  };

  // Mock putaway handler (replace with real mutation later)
  const handlePutAway = (locationId: string, quantity: number) => {
    if (quantity === 0) return;
    if (inventory.id === undefined) return;

    putAwayGoods.mutate({ inventoryId: inventory.id, locationId, quantity });
    setPendingChanges((prev) =>
      prev.filter((change) => change.locationId !== locationId)
    );
  };

  return (
    <div className=''>
      <h2 className='text-lg font-semibold'>
        Xếp hàng vào kho - Lấy hàng khỏi kho {warehouse.name}
      </h2>
      <div className='mb-0'>
        <strong>Tổng số lượng chưa xếp vào kho:</strong>{' '}
        {calculateUnassignedQuantity().toLocaleString('vi-VN')}
      </div>
      <LocationTree
        locations={warehouse.locations || []}
        inventory={inventory}
        inventoryLocations={inventoryLocations}
        pendingChanges={pendingChanges}
        setPendingChanges={setPendingChanges}
        onPutAway={handlePutAway}
        putAwayLoading={false}
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
    <div className='text-sm overflow-y-auto'>
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
  const isLevel0 = location.parentId === null; // Check if root level

  // For level 0, sum quantities of all descendants; for others, use direct quantity
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

  // Sync input state with pending changes
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
    console.log('Quantity Change:', {
      value,
      adjustedValue,
      maxPutIn,
      maxTakeOut,
      unassignedQuantity,
      adjustedQuantity,
    });
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
            {location.name} ({location.code}) -{' '}
            {isLevel0 ? 'Tổng trong khu: ' : 'Số lượng: '}{' '}
            {adjustedQuantity.toLocaleString('vi-VN')}
          </span>
          {!isLevel0 && (
            <div className='flex items-center space-x-1'>
              <Input
                type='number'
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 0)
                }
                placeholder={`${-adjustedQuantity} - ${unassignedQuantity}`}
                className='w-24'
                disabled={putAwayLoading}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handlePutAwayClick}
                disabled={putAwayLoading || quantity === '' || quantity === 0}
              >
                Vào/Ra
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

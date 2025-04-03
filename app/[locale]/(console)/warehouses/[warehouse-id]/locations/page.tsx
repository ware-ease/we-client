'use client';
import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Warehouse,
  Box,
  Plus,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { Location } from '@/types/warehouse';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/shadcn-base/Dialog';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn-base/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn-base/Command';
import { useAddWarehouseLocation } from '@/hooks/queries/warehouseQueries';

interface LocationNode extends Location {
  children: LocationNode[];
}

// Recursive component to render a location and its children
function LocationItem({ location }: { location: LocationNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className='my-2'>
      <div
        className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
          isExpanded ? 'bg-blue-50' : 'hover:bg-gray-100'
        }`}
        onClick={toggleExpand}
        role='button'
        aria-expanded={isExpanded}
        aria-label={`Toggle ${location.name}`}
      >
        {location.children.length > 0 ? (
          isExpanded ? (
            <ChevronDown className='mr-3 text-blue-600' size={22} />
          ) : (
            <ChevronRight className='mr-3 text-gray-600' size={22} />
          )
        ) : (
          <span className='mr-3 w-5' /> // Spacer for alignment
        )}
        {location.level === 0 ? (
          <Warehouse className='mr-3 text-gray-700' size={24} />
        ) : (
          <Box className='mr-3 text-green-600' size={24} />
        )}
        <span className='font-semibold text-gray-800'>
          {location.name} ({location.code})
        </span>
        <span className='ml-3 text-sm text-gray-500'>
          [Level {location.level} -{' '}
          {location.level === 0 ? 'No Putaway' : 'Putaway Capable'}]
        </span>
      </div>

      {isExpanded && location.children.length > 0 && (
        <div className='ml-8 mt-2 space-y-2 border-l-2 border-gray-200 pl-4'>
          {location.children.map((child) => (
            <LocationItem key={child.id} location={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WarehouseLocations() {
  const currentWarehouse = useCurrentWarehouse();
  const mutation = useAddWarehouseLocation();
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    code: '',
    parentId: 'none',
  });
  const [openPopover, setOpenPopover] = useState(false);

  useEffect(() => {
    if (currentWarehouse?.locations) {
      setLocations(currentWarehouse.locations);
    }
  }, [currentWarehouse]);

  const buildLocationTree = (locations: Location[]) => {
    const locationMap = new Map<string, LocationNode>();
    const roots: LocationNode[] = [];

    locations.forEach((loc) => {
      if (!loc.id) {
        console.warn('Location missing id, skipping:', loc);
        return;
      }
      locationMap.set(loc.id, { ...loc, children: [] });
    });

    const orphans: Location[] = [];
    locations.forEach((loc) => {
      if (!loc.id) return;
      const node = locationMap.get(loc.id)!;
      if (loc.parentId && locationMap.has(loc.parentId)) {
        locationMap.get(loc.parentId)!.children.push(node);
      } else if (!loc.parentId || loc.level === 0) {
        roots.push(node);
      } else {
        orphans.push(loc);
      }
    });

    if (orphans.length > 0) {
      console.warn('Orphaned locations (parentId not found):', orphans);
    }

    roots.sort((a, b) => a.name.localeCompare(b.name));
    roots.forEach((root) =>
      root.children.sort(
        (a, b) => a.level - b.level || a.name.localeCompare(b.name)
      )
    );

    return roots;
  };

  const flattenLocationTree = (tree: LocationNode[]): LocationNode[] => {
    const flatList: LocationNode[] = [];
    const traverse = (node: LocationNode) => {
      flatList.push(node);
      node.children.forEach(traverse);
    };
    tree.forEach(traverse);
    return flatList;
  };

  const handleAddLocation = async () => {
    const locationToAdd: Location = {
      id: '',
      name: newLocation.name,
      code: newLocation.code,
      level: 0,
      parentId: newLocation.parentId === 'none' ? null : newLocation.parentId,
      warehouseId: currentWarehouse?.id,
    };

    try {
      console.log('Adding location:', locationToAdd);
      const locations = new Array<Location>();
      locations.push(locationToAdd);
      const data = {
        locations: locations,
      };
      mutation.mutate(data);
      setLocations((prev) => [...prev, locationToAdd]);
      setNewLocation({ name: '', code: '', parentId: 'none' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add location:', error);
    }
  };

  if (!currentWarehouse) return <div className='p-6'>Loading...</div>;

  const locationTree = buildLocationTree(locations);
  const allLocations = flattenLocationTree(locationTree);
  const filteredTree = locationTree.filter(
    (area) =>
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.children.some(
        (loc) =>
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.children.some(
            (child) =>
              child.name.toLowerCase().includes(search.toLowerCase()) ||
              child.children.some((grandchild) =>
                grandchild.name.toLowerCase().includes(search.toLowerCase())
              )
          )
      )
  );

  return (
    <div className='p-4'>
      <h1 className='text-4xl font-bold mb-4 text-gray-800'>
        Các vị trí trong kho {currentWarehouse.name}
      </h1>
      <div className='flex items-center mb-4'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Tìm vị trí theo tên...'
          className='p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='ml-4 bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='mr-2' size={20} />
              Thêm vị trí
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Thêm vị trí mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo vị trí mới trong kho.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 mt-4'>
              <div>
                <Label htmlFor='name'>Tên vị trí</Label>
                <Input
                  id='name'
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                  placeholder='Ví dụ: Khu chứa cát'
                />
              </div>
              <div>
                <Label htmlFor='code'>Mã vị trí</Label>
                <Input
                  id='code'
                  value={newLocation.code}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, code: e.target.value })
                  }
                  placeholder='Ví dụ: KHUCC'
                />
              </div>
              <div>
                <Label htmlFor='parentId'>Khu vực</Label>
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={openPopover}
                      className='w-full justify-between border-gray-300'
                    >
                      {newLocation.parentId === 'none'
                        ? 'Là khu vực'
                        : allLocations.find(
                            (loc) => loc.id === newLocation.parentId
                          )?.name || 'Là khu vực'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command
                    // filter={(value, search) => {
                    //   console.log(value, search);
                    //   if (value.includes(search)) return 1;
                    //   return 0;
                    // }}
                    >
                      <CommandInput placeholder='Tìm khu vực...' />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy khu vực.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value='Là khu vực'
                            onSelect={() => {
                              setNewLocation({
                                ...newLocation,
                                parentId: 'none',
                              });
                              setOpenPopover(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                newLocation.parentId === 'none'
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              }`}
                            />
                            Là khu vực
                          </CommandItem>
                          {allLocations.map((loc) => (
                            <CommandItem
                              key={loc.id}
                              value={`${loc.name} (${loc.code}) - Level ${loc.level}`}
                              onSelect={() => {
                                setNewLocation({
                                  ...newLocation,
                                  parentId: loc.id,
                                });
                                setOpenPopover(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  newLocation.parentId === loc.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                }`}
                              />
                              {loc.name} ({loc.code}) - Level {loc.level}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={handleAddLocation}
                className='w-full bg-blue-600 hover:bg-blue-700'
              >
                Tạo vị trí
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className='space-y-2'>
        {filteredTree.length === 0 ? (
          <p className='text-gray-500'>
            {search
              ? 'Không tìm thấy vị trí.'
              : 'Kho này chưa có vị trí. Hãy tạo ngay!'}
          </p>
        ) : (
          filteredTree.map((location) => (
            <LocationItem key={location.id} location={location} />
          ))
        )}
      </div>
    </div>
  );
}

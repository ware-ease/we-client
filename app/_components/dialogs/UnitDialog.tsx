'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import { Edit, Search, Trash2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from 'react-toastify';

interface UnitDialogProps {
  children: ReactNode;
}
const UnitDialog = ({ children }: UnitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [units, setUnits] = useState<string[]>([
    'Kg',
    'Liters',
    'Pieces',
    'Boxes',
  ]);
  const [filteredUnits, setFilteredUnits] = useState(units);
  const [newUnit, setNewUnit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAddUnit = () => {
    if (!newUnit.trim()) {
      toast.error('Please enter a valid unit.');
      return;
    }
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    setFilteredUnits(updatedUnits);
    setNewUnit('');
    setShowForm(false);
    toast.success('Unit added successfully!');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredUnits(
      units.filter((unit) => unit.toLowerCase().includes(value.toLowerCase()))
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Manage Units
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='unit-name' className='text-red-600'>
              Unit Name*
            </Label>
            <Input
              id='unit-name'
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder='Enter unit...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                className='bg-blue-500 text-white'
                onClick={handleAddUnit}
              >
                Save and Select
              </Button>
              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white mb-3'
            onClick={() => setShowForm(true)}
          >
            + New Unit
          </Button>
        )}

        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search unit...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>Units</h3>
          <ul className='mt-2 space-y-2'>
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center p-2 border rounded-md hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className='text-gray-700'>{unit}</span>
                  {hoveredIndex === index && (
                    <div className='flex space-x-2'>
                      <Edit className='text-blue-600 h-4 w-4 cursor-pointer' />
                      <Trash2 className='text-red-600 h-4 w-4 cursor-pointer' />
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                No units found.
              </p>
            )}
          </ul>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='px-4 py-2 hover:bg-slate-200'
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnitDialog;

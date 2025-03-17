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

interface SupplierDialogProps {
  children: ReactNode;
}
const SupplierDialog = ({ children }: SupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); // Kiểm soát hiển thị form
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [newSupplier, setNewSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAddSupplier = () => {
    if (!newSupplier.trim()) {
      toast.error('Please enter a valid supplier name.');
      return;
    }

    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    setFilteredSuppliers(updatedSuppliers);
    setNewSupplier('');
    setShowForm(false); // Ẩn form sau khi thêm
    toast.success('Supplier added successfully!');
  };

  // Lọc danh sách theo từ khóa tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Manage Suppliers
          </DialogTitle>
        </DialogHeader>

        {/* Form Add Supplier */}
        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='supplier-name' className='text-red-600'>
              Supplier Name*
            </Label>
            <Input
              id='supplier-name'
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder='Enter supplier name...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                className='bg-blue-500 text-white'
                onClick={handleAddSupplier}
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
            + New Supplier
          </Button>
        )}

        {/* Search Bar */}
        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Search supplier...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        {/* Danh sách Suppliers */}
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>Suppliers</h3>
          <ul className='mt-2 space-y-2'>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className='text-gray-700'>{supplier}</span>
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
                No suppliers found.
              </p>
            )}
          </ul>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDialog;

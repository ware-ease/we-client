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
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  updateUnit,
} from '@/lib/services/unitService';
import { Unit } from '@/lib/types/unit';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UnitDialogProps {
  children: ReactNode;
}

const UnitDialog = ({ children }: UnitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  useEffect(() => {
    if (open) fetchUnits();
  }, [open]);

  const fetchUnits = async () => {
    try {
      const data = await getAllUnits();
      setUnits(data);
      setFilteredUnits(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn vị:', error);
      toast.error('Không thể tải danh sách đơn vị.');
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.trim()) {
      toast.error('Vui lòng nhập tên đơn vị hợp lệ.');
      return;
    }

    try {
      const createdUnit = await createUnit({ name: newUnit });
      setUnits([...units, createdUnit]);
      setFilteredUnits([...units, createdUnit]);
      setNewUnit('');
      setShowForm(false);
      toast.success('Thêm đơn vị thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm đơn vị:', error);
      toast.error('Không thể thêm đơn vị.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredUnits(
      units.filter((unit) =>
        unit.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit.id);
    setEditedName(unit.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateUnit(id, { name: editedName });
      const updatedUnits = units.map((unit) =>
        unit.id === id ? { ...unit, name: editedName } : unit
      );
      setUnits(updatedUnits);
      setFilteredUnits(updatedUnits);
      setEditingUnit(null);
      toast.success('Cập nhật đơn vị thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật đơn vị:', error);
      toast.error('Không thể cập nhật đơn vị.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUnit(null);
    setEditedName('');
  };

  const handleDeleteUnit = async () => {
    if (!unitToDelete) return;
    try {
      await deleteUnit(unitToDelete?.id || '');
      const updatedUnits = units.filter((unit) => unit.id !== unitToDelete.id);
      setUnits(updatedUnits);
      setFilteredUnits(updatedUnits);
      toast.success('Xóa đơn vị thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa đơn vị:', error);
      toast.error('Không thể xóa đơn vị.');
    } finally {
      setDeleteDialogOpen(false);
      setUnitToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý đơn vị
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='unit-name' className='text-red-600'>
              Tên đơn vị *
            </Label>
            <Input
              id='unit-name'
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder='Nhập đơn vị...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleAddUnit}>Lưu và chọn</Button>
              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Thêm đơn vị mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm đơn vị...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách đơn vịvị
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredUnits.length > 0 ? (
              filteredUnits.map((unit, index) => (
                <li
                  key={unit.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingUnit === unit.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(unit.id)}
                      />
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{unit.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditUnit(unit)}
                          />
                          <Trash2
                            className='text-red-600 h-4 w-4 cursor-pointer'
                            onClick={() => {
                              setUnitToDelete(unit);
                              setDeleteDialogOpen(true);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                Không có nhà cung cấp nào.
              </p>
            )}
          </ul>
        </div>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className='max-w-sm bg-white p-5 rounded-lg shadow-lg'>
            <DialogHeader>
              <DialogTitle className='text-red-600'>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>
              Bạn có chắc chắn muốn xóa đơn vị &quot;
              {unitToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDeleteUnit}>
                Xóa
              </Button>
              <DialogClose asChild>
                <Button variant='secondary'>Hủy</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='px-4 py-2 hover:bg-slate-200'
            >
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnitDialog;

'use client';

import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import {
  useAddUnit,
  useDeleteUnit,
  useUnits,
  useUpdateUnit,
} from '@/hooks/queries/unitQueries';
import { Unit } from '@/types/unit';
import { Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';

interface UnitDialogProps {
  children: ReactNode;
}

const UnitDialog = ({ children }: UnitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: units } = useUnits();
  const [filteredUnits, setFilteredUnits] = useState<Unit[] | undefined>(
    undefined
  );
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: '',
    note: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [editedUnit, setEditedUnit] = useState<Partial<Unit>>({});
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const addUnitMutation = useAddUnit();
  const updateUnitMutation = useUpdateUnit();
  const deleteUnitMutation = useDeleteUnit();

  useEffect(() => {
    setFilteredUnits(units);
  }, [units]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredUnits(
      units?.filter((unit) =>
        unit.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditUnit = (unit: Unit) => {
    setNewUnit(unit); // Gán unit hiện tại vào newUnit để chỉnh sửa
    setShowForm(true); // Hiển thị form
  };

  const handleSaveUnit = () => {
    if (!newUnit.name?.trim()) {
      toast.error('Vui lòng nhập thông tin đơn vị hợp lệ.');
      return;
    }

    if (newUnit.id) {
      updateUnitMutation.mutate(
        {
          id: newUnit.id,
          name: newUnit.name,
          note: newUnit.note ?? '',
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật đơn vị thành công!');
            setShowForm(false);
          },
          onError: () => {
            toast.error('Không thể cập nhật đơn vị.');
          },
        }
      );
    } else {
      addUnitMutation.mutate({ ...newUnit } as Unit, {
        onSuccess: () => {
          toast.success('Thêm đơn vị thành công!');
          setShowForm(false);
          setNewUnit({ name: '', note: '' });
        },
        onError: () => {
          toast.error('Không thể thêm đơn vị.');
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUnit(null);
    setEditedUnit({});
  };

  const handleDeleteUnit = () => {
    if (!unitToDelete) return;
    deleteUnitMutation.mutate(unitToDelete.id!, {
      onSuccess: () => {
        toast.success('Xóa đơn vị thành công!');
      },
      onError: () => toast.error('Không thể xóa đơn vị.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý đơn vị</DialogTitle>
        </DialogHeader>
        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label className='text-red-600'>Tên đơn vị *</Label>
              <Input
                value={newUnit.name}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, name: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Input
                value={newUnit.note}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, note: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveUnit}>
                {newUnit.id ? 'Lưu thay đổi' : 'Lưu và chọn'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewUnit({ name: '', note: '' });
                  setShowForm(false);
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Tạo đơn vị mới
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
            Danh sách đơn vị
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredUnits?.length ?? 0 > 0 ? (
              filteredUnits?.map((unit, index) => (
                <li
                  key={unit.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingUnit === unit.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedUnit.name || ''}
                        onChange={(e) =>
                          setEditedUnit({
                            ...editedUnit,
                            name: e.target.value,
                          })
                        }
                        className='flex-1'
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
                          <DeleteDialog
                            onConfirmDelete={handleDeleteUnit}
                            title='Xóa đơn vị'
                            description='Bạn có chắc chắn muốn xóa đơn vị này không?'
                            isLoading={deleteUnitMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setUnitToDelete(unit);
                              }}
                            />
                          </DeleteDialog>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                Không có đơn vị nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitDialog;

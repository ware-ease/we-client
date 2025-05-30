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
  useAddSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from '@/hooks/queries/supplierQueries';
import { Supplier } from '@/types/supplier';
import { Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';

interface SupplierDialogProps {
  children: ReactNode;
}

const SupplierDialog = ({ children }: SupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: suppliers } = useSuppliers();
  const [filteredSuppliers, setFilteredSuppliers] = useState<
    Supplier[] | undefined
  >(undefined);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    phone: '',
    status: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [editedSupplier, setEditedSupplier] = useState<Partial<Supplier>>({});
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

  const addSupplierMutation = useAddSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredSuppliers(
      suppliers?.filter((supplier) =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setNewSupplier(supplier); // Gán supplier hiện tại vào newSupplier để chỉnh sửa
    setShowForm(true); // Hiển thị form
  };

  const handleSaveSupplier = () => {
    if (!newSupplier.name?.trim() || !newSupplier.phone?.trim()) {
      toast.error('Vui lòng nhập thông tin nhà cung cấp hợp lệ.');
      return;
    }

    if (newSupplier.id) {
      updateSupplierMutation.mutate(
        {
          id: newSupplier.id,
          name: newSupplier.name,
          phone: newSupplier.phone ?? '',
          status: newSupplier.status ?? true,
        },
        {
          onSuccess: () => {
            // toast.success('Cập nhật nhà cung cấp thành công!');
            setShowForm(false);
          },
          onError: () => {
            toast.error('Không thể cập nhật nhà cung cấp.');
          },
        }
      );
    } else {
      addSupplierMutation.mutate({
        name: newSupplier.name || '',
        phone: newSupplier.phone || '',
        status: newSupplier.status ?? true
      }, {
        onSuccess: () => {
          // toast.success('Thêm nhà cung cấp thành công!');
          setShowForm(false);
          setNewSupplier({
            name: '',
            phone: '',
            status: true,
          });
        },
        onError: () => {
          toast.error('Không thể thêm nhà cung cấp.');
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setEditedSupplier({});
  };

  const handleDeleteSupplier = () => {
    if (!supplierToDelete) return;
    deleteSupplierMutation.mutate(supplierToDelete.id!, {
      onSuccess: () => {
        // toast.success('Xóa nhà cung cấp thành công!');
      },
      onError: () => toast.error('Không thể xóa nhà cung cấp.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý nhà cung cấp</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label className='text-red-600'>Tên nhà cung cấp *</Label>
              <Input
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
                className='bg-white'
              />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
                className='bg-white'
              />
            </div>
            {/* <div>
              <Label>Trạng thái</Label>
              <select
                value={newSupplier.status}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    status: e.target.value as 'active' | 'inactive' | 'banned',
                  })
                }
                className='bg-white p-2 border rounded-md w-full'
              >
                <option value='active'>Hoạt động</option>
                <option value='inactive'>Không hoạt động</option>
                <option value='banned'>Cấm</option>
              </select>
            </div> */}
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveSupplier}>
                {newSupplier.id ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewSupplier({
                    name: '',
                    phone: '',
                    // status: 'active',
                  });
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
            + Thêm nhà cung cấp mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm nhà cung cấp...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>
        <div className='border rounded-md p-3 max-h-48 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách nhà cung cấp
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredSuppliers?.length ?? 0 > 0 ? (
              filteredSuppliers?.map((supplier, index) => (
                <li
                  key={supplier.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingSupplier === supplier.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedSupplier.name || ''}
                        onChange={(e) =>
                          setEditedSupplier({
                            ...editedSupplier,
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
                      <span className='text-gray-700'>{supplier.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditSupplier(supplier)}
                          />

                          <DeleteDialog
                            onConfirmDelete={handleDeleteSupplier}
                            title='Xóa nhà cung cấp'
                            description='Bạn có chắc chắn muốn xóa nhà cung cấp này không?'
                            isLoading={deleteSupplierMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setSupplierToDelete(supplier);
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
                Không có nhà cung cấp nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierDialog;

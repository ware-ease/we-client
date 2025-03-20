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
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from '@/lib/services/supplierService';
import { Supplier } from '@/lib/types/supplier';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface SupplierDialogProps {
  children: ReactNode;
  suppliers: Supplier[];
  fetchSuppliers: () => Promise<void>;
}

const SupplierDialog = ({
  children,
  suppliers,
  fetchSuppliers,
}: SupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] =
    useState<Supplier[]>(suppliers);
  const [newSupplier, setNewSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  // const fetchSuppliers = async () => {
  //   try {
  //     const data = await getAllSuppliers();
  //     setSuppliers(data);
  //     setFilteredSuppliers(data);
  //   } catch (error) {
  //     console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
  //     toast.error('Không thể tải danh sách nhà cung cấp.');
  //   }
  // };

  const handleAddSupplier = async () => {
    if (!newSupplier.trim()) {
      toast.error('Vui lòng nhập tên nhà cung cấp hợp lệ.');
      return;
    }

    try {
      await createSupplier({ name: newSupplier });
      await fetchSuppliers();
      setNewSupplier('');
      toast.success('Thêm nhà cung cấp thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm nhà cung cấp:', error);
      toast.error('Không thể thêm nhà cung cấp.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier.id);
    setEditedName(supplier.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateSupplier(id, { name: editedName });
      await fetchSuppliers(); // Cập nhật danh sách sau khi chỉnh sửa
      setEditingSupplier(null);
      toast.success('Cập nhật nhà cung cấp thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung cấp:', error);
      toast.error('Không thể cập nhật nhà cung cấp.');
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setEditedName('');
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    try {
      await deleteSupplier(supplierToDelete.id);
      toast.success(`Đã xóa nhà cung cấp: ${supplierToDelete.name}`);
      await fetchSuppliers(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa nhà cung cấp:', error);
      toast.error('Không thể xóa nhà cung cấp.');
    } finally {
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý nhà cung cấp
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='supplier-name' className='text-red-600'>
              Tên nhà cung cấp*
            </Label>
            <Input
              id='supplier-name'
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder='Nhập tên nhà cung cấp...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleAddSupplier}>Lưu và Chọn</Button>
              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Tạo nhà cung cấp mới
          </Button>
        )}

        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Tìm kiếm nhà cung cấp...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách nhà cung cấp
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <li
                  key={supplier.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingSupplier === supplier.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(supplier.id)}
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
                          <Trash2
                            className='text-red-600 h-4 w-4 cursor-pointer'
                            onClick={() => {
                              setSupplierToDelete(supplier);
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
              Bạn có chắc chắn muốn xóa nhà cung cấp &quot;
              {supplierToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDeleteSupplier}>
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

export default SupplierDialog;

'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  useAddBrand,
  useBrands,
  useDeleteBrand,
  useUpdateBrand,
} from '@/lib/hooks/queries/brandQueries';
import { Brand } from '@/lib/types/brand';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { DeleteDialog } from './DeleteDialog';

interface BrandDialogProps {
  children: ReactNode;
}

const BrandDialog = ({ children }: BrandDialogProps) => {
  const { data: brands, isPending } = useBrands();
  const addBrandMutation = useAddBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState<Brand[] | undefined>([]);
  const [newBrand, setNewBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [brandToDelete, setBrandToDelete] = useState<string>('');

  useEffect(() => {
    setFilteredBrands(brands);
  }, [brands]);

  //   const fetchBrands = async () => {
  //     try {
  //       const data = await getAllBrands();
  //       setBrands(data);
  //       setFilteredBrands(data);
  //     } catch (error) {
  //       console.error('Lỗi khi tải danh sách thương hiệu:', error);
  //       toast.error('Không thể tải danh sách thương hiệu.');
  //     }
  //   };

  //   const handleAddBrand = async () => {
  //     if (!newBrand.trim()) {
  //       toast.error('Vui lòng nhập tên thương hiệu hợp lệ.');
  //       return;
  //     }
  //     try {
  //       await createBrand({ name: newBrand });
  //       toast.success('Thêm thương hiệu thành công!');
  //       setNewBrand('');
  //       setShowForm(false);
  //       onRefresh();
  //     } catch (error) {
  //       console.error(error);
  //       toast.error('Không thể thêm thương hiệu.');
  //     }
  //   };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!brands) return;

    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(value)
    );

    setFilteredBrands(filtered);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand.id);
    setEditedName(brand.name);
  };

  const handleSaveEdit = (id: string) => {
    updateBrandMutation.mutate({ id, name: editedName });
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setEditedName('');
  };

  const handleConfirmDelete = () => {
    deleteBrandMutation.mutate(brandToDelete);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý thương hiệu
          </DialogTitle>
        </DialogHeader>

        {/* Form thêm thương hiệu */}
        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='brand-name' className='text-red-600'>
              Tên thương hiệu *
            </Label>
            <Input
              id='brand-name'
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder='Nhập thương hiệu...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                onClick={() => addBrandMutation.mutate({ name: newBrand })}
                disabled={addBrandMutation.isPending}
              >
                {addBrandMutation.isPending ? 'Đang lưu...' : 'Lưu và chọn'}
              </Button>

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
            + Thêm thương hiệu mới
          </Button>
        )}

        {/* Thanh tìm kiếm */}
        <div className='relative mt-3'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm thương hiệu...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        {/* Danh sách thương hiệu */}
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách thương hiệu
          </h3>
          <ul className='mt-2 space-y-2'>
            {isPending ? (
              <p className='text-gray-500 text-sm text-center'>Đang tải...</p>
            ) : filteredBrands && filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <li
                  key={brand.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingBrand === brand.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(brand.id)}
                      />
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{brand.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditBrand(brand)}
                          />
                          <DeleteDialog
                            onConfirmDelete={handleConfirmDelete}
                            title='Xóa thương hiệu'
                            description='Bạn có chắc chắn muốn xóa thương hiệu này không?'
                            isLoading={deleteBrandMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setBrandToDelete(brand.id);
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
                Không có thương hiệu nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandDialog;

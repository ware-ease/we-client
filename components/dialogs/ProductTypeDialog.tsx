'use client';

import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import {
  createProductType,
  deleteProductType,
  getAllProductTypes,
  updateProductType,
} from '@/services/productService';
import { ProductType } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from 'react-toastify';

interface ProductTypeDialogProps {
  children: ReactNode;
  productTypes: ProductType[] | undefined;
  onRefresh: () => void;
}

const ProductTypeDialog = ({
  children,
  productTypes,
  onRefresh,
}: ProductTypeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredProductTypes, setFilteredProductTypes] = useState<
    ProductType[] | undefined
  >(productTypes);
  const [newProductType, setNewProductType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingProductType, setEditingProductType] = useState<
    string | undefined
  >(undefined);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState<
    ProductType | undefined
  >(undefined);

  const productTypesQuery = useQuery({
    queryKey: ['productTypes'],
    queryFn: getAllProductTypes,
  });
  const queryClient = useQueryClient();

  const addProductTypeMutation = useMutation({
    mutationFn: async () =>
      await createProductType({ name: newProductType, note: '' }),
    onSuccess: () => {
      toast.success('Thêm loại sản phẩm thành công!');
      setNewProductType('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      onRefresh();
    },
    onError: () => toast.error('Không thể thêm loại sản phẩm.'),
  });

  const updateProductTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      const existingProductType = productTypes?.find((pt) => pt.id === id);
      if (!existingProductType) {
        toast.error('Không tìm thấy loại sản phẩm.');
        return;
      }
      await updateProductType(id, {
        name: editedName,
        note: existingProductType.note,
      });
    },
    onError: () => toast.error('Không thể cập nhật loại sản phẩm.'),
  });

  const deleteProductTypeMutation = useMutation({
    mutationFn: async (id: string) => await deleteProductType(id),
    onSuccess: () => {
      toast.success('Xóa loại sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      onRefresh();
    },
    onError: () => toast.error('Không thể xóa loại sản phẩm.'),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!productTypes) return;

    const filtered = productTypes.filter((brand) =>
      brand.name.toLowerCase().includes(value)
    );

    setFilteredProductTypes(filtered);
  };

  const handleEditProductType = (producttype: ProductType) => {
    setEditingProductType(producttype.id);
    setEditedName(producttype.name);
  };

  const handleSaveEdit = (id?: string) => {
    updateProductTypeMutation.mutate(id ?? '');
  };

  const handleCancelEdit = () => {
    setEditingProductType(undefined);
    setEditedName('');
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý loại sản phẩm
          </DialogTitle>
        </DialogHeader>

        {/* Form thêm loại sản phẩm */}
        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='product-type-name' className='text-red-600'>
              Tên loại sản phẩm *
            </Label>
            <Input
              id='product-type-name'
              value={newProductType}
              onChange={(e) => setNewProductType(e.target.value)}
              placeholder='Nhập loại sản phẩm...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                onClick={() => addProductTypeMutation.mutate()}
                disabled={addProductTypeMutation.isPending}
              >
                {addProductTypeMutation.isPending
                  ? 'Đang lưu...'
                  : 'Lưu và chọn'}
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
            + Thêm loại sản phẩm mới
          </Button>
        )}

        {/* Thanh tìm kiếm */}
        <div className='relative mt-3'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm loại sản phẩm...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        {/* Danh sách loại sản phẩm */}
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách loại sản phẩm
          </h3>
          <ul className='mt-2 space-y-2'>
            {productTypesQuery.isLoading ? (
              <p className='text-gray-500 text-sm text-center'>Đang tải...</p>
            ) : filteredProductTypes && filteredProductTypes.length > 0 ? (
              filteredProductTypes.map((type, index) => (
                <li
                  key={type.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingProductType === type.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(type.id)}
                      />
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{type.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditProductType(type)}
                          />
                          <Trash2
                            className='text-red-600 h-4 w-4 cursor-pointer'
                            onClick={() => {
                              setProductTypeToDelete(type);
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
                Không có loại sản phẩm nào.
              </p>
            )}
          </ul>
        </div>

        {/* Dialog xác nhận xóa */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className='max-w-sm bg-white p-5 rounded-lg shadow-lg'>
            <DialogHeader>
              <DialogTitle className='text-red-600'>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>
              Bạn có chắc chắn muốn xóa loại sản phẩm &quot;
              {productTypeToDelete?.name}&quot; không?
            </p>
            <DialogFooter>
              <Button
                variant='destructive'
                onClick={() =>
                  productTypeToDelete &&
                  deleteProductTypeMutation.mutate(
                    productTypeToDelete?.id ?? ''
                  )
                }
                disabled={deleteProductTypeMutation.isPending}
              >
                {deleteProductTypeMutation.isPending ? 'Đang xóa...' : 'Xóa'}
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

export default ProductTypeDialog;

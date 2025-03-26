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
  useAddProductType,
  useDeleteProductType,
  useProductTypes,
  useUpdateProductType,
} from '@/hooks/queries/productTypeQueries';
import { ProductType } from '@/types/product';
import { Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';

interface ProductTypeDialogProps {
  children: ReactNode;
}

const ProductTypeDialog = ({ children }: ProductTypeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: productTypes } = useProductTypes();
  const [filteredProductTypes, setFilteredProductTypes] = useState<
    ProductType[] | undefined
  >(undefined);
  const [newProductType, setNewProductType] = useState<Partial<ProductType>>({
    name: '',
    note: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingProductType, setEditingProductType] = useState<string | null>(
    null
  );
  const [editedProductType, setEditedProductType] = useState<
    Partial<ProductType>
  >({});
  const [productTypeToDelete, setProductTypeToDelete] =
    useState<ProductType | null>(null);
  const addProductTypeMutation = useAddProductType();
  const updateProductTypeMutation = useUpdateProductType();
  const deleteProductTypeMutation = useDeleteProductType();

  useEffect(() => {
    setFilteredProductTypes(productTypes);
  }, [productTypes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredProductTypes(
      productTypes?.filter((productType) =>
        productType.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditProductType = (productType: ProductType) => {
    setNewProductType(productType); // Gán productType hiện tại vào newProductType để chỉnh sửa
    setShowForm(true); // Hiển thị form
  };

  const handleSaveProductType = () => {
    if (!newProductType.name?.trim()) {
      toast.error('Vui lòng nhập thông tin loại sản phẩm hợp lệ.');
      return;
    }

    if (newProductType.id) {
      updateProductTypeMutation.mutate(
        {
          id: newProductType.id,
          name: newProductType.name,
          note: newProductType.note ?? '',
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật loại sản phẩm thành công!');
            setShowForm(false);
          },
          onError: () => {
            toast.error('Không thể cập nhật loại sản phẩm.');
          },
        }
      );
    } else {
      addProductTypeMutation.mutate({ ...newProductType } as ProductType, {
        onSuccess: () => {
          toast.success('Thêm loại sản phẩm thành công!');
          setShowForm(false);
          setNewProductType({ name: '', note: '' });
        },
        onError: () => {
          toast.error('Không thể thêm loại sản phẩm.');
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProductType(null);
    setEditedProductType({});
  };

  const handleDeleteProductType = () => {
    if (!productTypeToDelete) return;
    deleteProductTypeMutation.mutate(productTypeToDelete.id!, {
      onSuccess: () => {
        toast.success('Xóa loại sản phẩm thành công!');
      },
      onError: () => toast.error('Không thể xóa loại sản phẩm.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý loại sản phẩm</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label className='text-red-600'>Tên loại sản phẩm *</Label>
              <Input
                value={newProductType.name}
                onChange={(e) =>
                  setNewProductType({ ...newProductType, name: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Input
                value={newProductType.note}
                onChange={(e) =>
                  setNewProductType({ ...newProductType, note: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveProductType}>
                {newProductType.id ? 'Lưu thay đổi' : 'Lưu và chọn'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewProductType({ name: '', note: '' });
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
            + Tạo loại sản phẩm mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm loại sản phẩm...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách loại sản phẩm
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredProductTypes?.length ?? 0 > 0 ? (
              filteredProductTypes?.map((productType, index) => (
                <li
                  key={productType.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingProductType === productType.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedProductType.name || ''}
                        onChange={(e) =>
                          setEditedProductType({
                            ...editedProductType,
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
                      <span className='text-gray-700'>{productType.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditProductType(productType)}
                          />

                          <DeleteDialog
                            onConfirmDelete={handleDeleteProductType}
                            title='Xóa loại sản phẩm'
                            description='Bạn có chắc chắn muốn xóa loại sản phẩm này không?'
                            isLoading={deleteProductTypeMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setProductTypeToDelete(productType);
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
                Không có loại sản phẩm nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTypeDialog;

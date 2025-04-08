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
  useAddProduct,
  useDeleteProduct,
  useProducts,
} from '@/hooks/queries/productQueries';
import { Product } from '@/types/product';
import { ProductCreate } from '@/types/request/product';
import { Search, Trash2 } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';
interface ProductDialogProps {
  children: ReactNode;
}

const ProductDialog = ({ children }: ProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data: products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<
    Product[] | undefined
  >(undefined);
  const [newProduct, setNewProduct] = useState<Partial<ProductCreate>>({
    sku: '',
    name: '',
    imageUrl: '',
    productTypeId: '',
    brandId: '',
    unitId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const addProductMutation = useAddProduct();
  const deleteProductMutation = useDeleteProduct();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredProducts(
      products?.filter((product) =>
        (product.name ?? '').toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSaveProduct = () => {
    if (!newProduct.name?.trim()) {
      toast.error('Vui lòng nhập thông tin sản phẩm hợp lệ.');
      return;
    }

    addProductMutation.mutate({ ...newProduct } as ProductCreate, {
      onSuccess: () => {
        toast.success('Thêm sản phẩm thành công!');
        setShowForm(false);
        setNewProduct({
          sku: '',
          name: '',
          imageUrl: '',
          productTypeId: '',
          brandId: '',
          unitId: '',
        });
      },
      onError: () => {
        toast.error('Không thể thêm sản phẩm.');
      },
    });
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id!, {
      onSuccess: () => {
        toast.success('Xóa sản phẩm thành công!');
      },
      onError: () => toast.error('Không thể xóa sản phẩm.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý sản phẩm</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50 max-h-[30vh] overflow-y-auto'>
            <div>
              <Label className='text-red-600'>Mã sản phẩm (SKU) *</Label>
              <Input
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label className='text-red-600'>Tên sản phẩm *</Label>
              <Input
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className='bg-white'
              />
            </div>
            {/* <div>
              <Label>Hình ảnh URL</Label>
              <Input
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                className='bg-white'
              />
            </div> */}
            <div>
              <Label>Loại sản phẩm</Label>
              <Input
                value={newProduct.productTypeId}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    productTypeId: e.target.value,
                  })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Thương hiệu</Label>
              <Input
                value={newProduct.brandId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brandId: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Đơn vị tính</Label>
              <Input
                value={newProduct.unitId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, unitId: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveProduct}>Lưu và chọn</Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewProduct({
                    sku: '',
                    name: '',
                    imageUrl: '',
                    productTypeId: '',
                    brandId: '',
                    unitId: '',
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
            + Tạo sản phẩm mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách sản phẩm
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredProducts?.length ?? 0 > 0 ? (
              filteredProducts?.map((product, index) => (
                <li
                  key={product.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className='text-gray-700'>{product.name}</span>
                  {hoveredIndex === index && (
                    <div className='flex space-x-2'>
                      <DeleteDialog
                        onConfirmDelete={handleDeleteProduct}
                        title='Xóa sản phẩm'
                        description='Bạn có chắc chắn muốn xóa sản phẩm này không?'
                        isLoading={deleteProductMutation.isPending}
                      >
                        <Trash2
                          className='text-red-600 h-4 w-4 cursor-pointer'
                          onClick={() => {
                            setProductToDelete(product);
                          }}
                        />
                      </DeleteDialog>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                Không có sản phẩm nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;

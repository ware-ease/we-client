'use client';
import { useProduct } from '@/hooks/queries/productQueries';
import { useBatchesByProductId } from '@/hooks/queries/batchQueries';
import { useWarehouses } from '@/hooks/queries/accountQueries';
import { useWarehousesInventoriesByProductID } from '@/hooks/queries/warehouseQueries';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Product } from '@/types/product';
import StockCard from './StockCard';
import { useRouter } from '@/lib/i18n/routing';

const stockCardData = {
  productCode: 'JTT18SNDU',
  productName: 'Sơn dầu Jotun',
  unitName: 'Thùng 18L',
  warehouseName: 'Kho Sài Gòn',
  details: [
    {
      date: '2025-04-13T08:33:38.366',
      code: 'TNK13041',
      description: 'nhập thiếu 100',
      import: 99,
      export: 0,
      stock: 99,
      note: 'LOT0002',
    },
    {
      date: '2025-04-15T08:33:38.366',
      code: 'TNK15042',
      description: 'nhập đủ',
      import: 100,
      export: 0,
      stock: 199,
      note: 'LOT0004',
    },
  ],
};

const ProductDetail = () => {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productIdStr = Array.isArray(productId) ? productId[0] : productId;
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productIdStr || '');
  const { data: batches } = useBatchesByProductId(productIdStr || '');
  const { data: warehouses } = useWarehouses();

  // Current warehouse state
  const [currentWarehouseId, setCurrentWarehouseId] = useState<string>(
    (searchParams.get('currentWarehouseId') as string) || ''
  );
  const { data: inventories } = useWarehousesInventoriesByProductID(
    currentWarehouseId !== undefined,
    currentWarehouseId || '',
    productIdStr || ''
  );

  // Product edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name,
    sku: product?.sku,
    unit: product?.unit,
    category: product?.category,
    note: product?.note,
  });

  // Compute total quantity
  const totalQuantity = useMemo(
    () =>
      Array.isArray(inventories)
        ? inventories.reduce((sum, inv) => sum + inv.currentQuantity, 0)
        : 0,
    [inventories]
  );

  // Sync currentWarehouseId with searchParams
  React.useEffect(() => {
    const warehouseIdFromUrl = searchParams.get('currentWarehouseId');
    if (warehouseIdFromUrl && warehouseIdFromUrl !== currentWarehouseId) {
      setCurrentWarehouseId(warehouseIdFromUrl);
    }
  }, [searchParams]);

  // Set default warehouse and update URL
  React.useEffect(() => {
    if (warehouses && warehouses.length > 0 && !currentWarehouseId) {
      const defaultWarehouseId = warehouses[0].id;
      setCurrentWarehouseId(defaultWarehouseId);
      router.push(
        `/products/${productIdStr}?currentWarehouseId=${defaultWarehouseId}`
      );
    }
  }, [warehouses, currentWarehouseId, productIdStr, router]);

  // Update product form data
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        unit: product.unit,
        category: product.category,
        note: product.note,
      });
    }
  }, [product]);

  // Handle product form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product form submission (placeholder)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated product:', formData);
    // TODO: Integrate useUpdateProduct mutation here
    setIsEditModalOpen(false);
  };

  // Handle warehouse change and update URL
  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWarehouseId = e.target.value;
    setCurrentWarehouseId(newWarehouseId);
    router.push(
      `/products/${productIdStr}?currentWarehouseId=${newWarehouseId}`
    );
  };

  if (isProductLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>
        Lỗi tải sản phẩm hoặc không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className='mx-auto p-4 max-w-6xl'>
      <div className='w-full mb-4'>
        <div className='bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Chọn kho
          </h2>
          <div className='space-y-3'>
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-1'>
                Kho hiện tại
              </label>
              <select
                value={currentWarehouseId}
                onChange={handleWarehouseChange}
                className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                disabled={!warehouses || warehouses.length === 0}
              >
                {warehouses && warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))
                ) : (
                  <option value=''>Không có kho</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <div className='flex-1 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <div className='bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-t-xl text-white'>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <p className='text-sm text-white/80'>Mã SKU: {product.sku}</p>
          </div>
          <div className='p-5 space-y-3'>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Đơn vị:</strong> {product.unit}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Danh mục:</strong>{' '}
              {product.category || 'Không có'}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Mô tả:</strong>{' '}
              {product.note || 'Không có'}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Tổng số lượng:</strong>{' '}
              {totalQuantity}
            </p>
            <div className='flex space-x-3'>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className='flex items-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-3xl hover:bg-blue-100 transition-colors text-sm'
              >
                <Pencil className='w-4 h-4 mr-1' />
                Sửa
              </button>
            </div>
          </div>
        </div>
        <div className='flex-1 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Danh sách lô
          </h2>
          {batches && batches.length > 0 ? (
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {batches.map((batch) => {
                const inventory = Array.isArray(inventories)
                  ? inventories.find((inv) => inv.batchId === batch.id)
                  : undefined;
                return (
                  <div
                    key={batch.id}
                    className='border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors last:border-b-0'
                  >
                    <p className='text-gray-600'>
                      <strong className='text-gray-700'>Mã lô:</strong>{' '}
                      {batch.code}
                    </p>
                    <p className='text-gray-600'>
                      <strong className='text-gray-700'>Hết hạn:</strong>{' '}
                      {new Date(batch.expDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className='text-gray-600'>
                      <strong className='text-gray-700'>Số lượng:</strong>{' '}
                      {inventory?.currentQuantity || 0}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-gray-600 text-center py-4'>
              Không có lô nào.
            </div>
          )}
        </div>
      </div>

      <StockCard data={stockCardData} />

      {/* Product Edit Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white border border-gray-200 shadow-lg rounded-xl p-6 w-full max-w-md md:max-w-md m-4'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Sửa thông tin sản phẩm
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>
                  Tên sản phẩm
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>
                  Mã SKU
                </label>
                <input
                  type='text'
                  name='sku'
                  value={formData.sku || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>
                  Đơn vị
                </label>
                <input
                  type='text'
                  name='unit'
                  value={formData.unit || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>
                  Danh mục
                </label>
                <input
                  type='text'
                  name='category'
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>
                  Mô tả
                </label>
                <textarea
                  name='note'
                  value={formData.note || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                  rows={4}
                />
              </div>
              <div className='flex space-x-3'>
                <button
                  type='submit'
                  className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition-colors text-sm'
                >
                  Lưu
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditModalOpen(false)}
                  className='flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-3xl hover:bg-gray-300 transition-colors text-sm'
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

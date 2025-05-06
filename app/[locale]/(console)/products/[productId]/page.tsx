'use client';
import { useProduct } from '@/hooks/queries/productQueries';
import { useBatchesByProductId } from '@/hooks/queries/batchQueries';
import { useWarehouses } from '@/hooks/queries/accountQueries';
import {
  useWarehousesInventoriesByProductID,
  useWarehousesStockCardByProductID,
} from '@/hooks/queries/warehouseQueries';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, Pencil, Filter } from 'lucide-react';
import { Product } from '@/types/product';
import StockCard from './StockCard';
import { useRouter } from '@/lib/i18n/routing';

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

  const { data: stockCard } = useWarehousesStockCardByProductID(
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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'expDate' | 'inboundDate' | ''>(
    ''
  );
  const [filterOrder, setFilterOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Compute total quantity
  const totalQuantity = useMemo(
    () =>
      Array.isArray(inventories)
        ? inventories.reduce((sum, inv) => sum + inv.currentQuantity, 0)
        : 0,
    [inventories]
  );

  // Filtered and sorted batches
  const filteredBatches = useMemo(() => {
    if (!batches) return [];
    let result = [...batches];

    // Search by batch code
    if (searchQuery) {
      result = result.filter((batch) =>
        batch.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by filter
    if (filterType) {
      result.sort((a, b) => {
        const dateA = filterType === 'expDate' ? a.expDate : a.inboundDate;
        const dateB = filterType === 'expDate' ? b.expDate : b.inboundDate;
        const timeA = dateA ? new Date(dateA).getTime() : Infinity;
        const timeB = dateB ? new Date(dateB).getTime() : Infinity;
        return filterOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    return result;
  }, [batches, searchQuery, filterType, filterOrder]);

  // Sync currentWarehouseId with searchParams
  useEffect(() => {
    const warehouseIdFromUrl = searchParams.get('currentWarehouseId');
    if (warehouseIdFromUrl && warehouseIdFromUrl !== currentWarehouseId) {
      setCurrentWarehouseId(warehouseIdFromUrl);
    }
  }, [searchParams]);

  // Set default warehouse and update URL
  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !currentWarehouseId) {
      const defaultWarehouseId = warehouses[0].id;
      setCurrentWarehouseId(defaultWarehouseId);
      router.push(
        `/products/${productIdStr}?currentWarehouseId=${defaultWarehouseId}`
      );
    }
  }, [warehouses, currentWarehouseId, productIdStr, router]);

  // Update product form data
  useEffect(() => {
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

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter selection
  const handleFilterSelect = (
    type: 'expDate' | 'inboundDate',
    order: 'asc' | 'desc'
  ) => {
    setFilterType(type);
    setFilterOrder(order);
    setIsFilterDropdownOpen(false);
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
    <div className='mx-auto max-w-6xl transform-none'>
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

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <div className='bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-t-xl text-white'>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <p className='text-sm text-white/80'>Mã SKU: {product.sku}</p>
          </div>
          <div className='p-5 space-y-3 border-l-2 border-r-2 border-b-2 rounded-b-xl'>
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
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Danh sách lô
            </h2>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                placeholder='Tìm kiếm mã lô...'
                value={searchQuery}
                onChange={handleSearchChange}
                className='border border-gray-200 rounded-lg p-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
              />
              <div className='relative'>
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className='flex items-center bg-transparent border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <Filter className='w-4 h-4 mr-1' />
                  Bộ lọc
                </button>
                {isFilterDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                    <button
                      onClick={() => handleFilterSelect('expDate', 'asc')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Hết hạn: Sớm nhất
                    </button>
                    <button
                      onClick={() => handleFilterSelect('expDate', 'desc')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Hết hạn: Muộn nhất
                    </button>
                    <button
                      onClick={() => handleFilterSelect('inboundDate', 'asc')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Nhập kho: Sớm nhất
                    </button>
                    <button
                      onClick={() => handleFilterSelect('inboundDate', 'desc')}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Nhập kho: Muộn nhất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {filteredBatches && filteredBatches.length > 0 ? (
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {filteredBatches.map((batch) => {
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
                      <strong className='text-gray-700'>Ngày nhập:</strong>{' '}
                      {batch.inboundDate
                        ? new Date(batch.inboundDate).toLocaleDateString(
                            'vi-VN'
                          )
                        : 'Không có'}
                    </p>
                    <p className='text-gray-600'>
                      <strong className='text-gray-700'>Hết hạn:</strong>{' '}
                      {batch.expDate
                        ? new Date(batch.expDate).toLocaleDateString('vi-VN')
                        : 'Không có'}
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
              Không có lô nào phù hợp.
            </div>
          )}
        </div>
      </div>

      {stockCard && <StockCard data={stockCard} />}

      {/* Product Edit Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transform-none'>
          <div className='bg-white border border-gray-200 shadow-lg rounded-xl p-6 w-full max-w-md md:max-w-md m-4 transform-none'>
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

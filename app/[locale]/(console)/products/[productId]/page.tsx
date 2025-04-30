'use client';
import { useProduct } from '@/hooks/queries/productQueries';
import { useBatchesByProductId } from '@/hooks/queries/batchQueries';
import { useWarehouses } from '@/hooks/queries/accountQueries';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Loader2, Pencil, Wrench, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { InventoryAdjustment } from '@/types/warehouse';

const ProductDetail = () => {
  const { productId } = useParams();
  const productIdStr = Array.isArray(productId) ? productId[0] : productId;
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productIdStr || '');
  const { data: batches } = useBatchesByProductId(productIdStr || '');
  const { data: warehouses } = useWarehouses();

  // Current warehouse state
  const [currentWarehouseId, setCurrentWarehouseId] = useState<string>('');
  const {
    data: inventoriesResponse,
    isLoading: isInventoriesLoading,
    error: inventoriesError,
  } = useWarehousesInventories(
    currentWarehouseId !== undefined,
    currentWarehouseId || ''
  );
  const inventories = inventoriesResponse?.inventories || [];

  // Product edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name,
    sku: product?.sku,
    unit: product?.unit,
    category: product?.category,
    note: product?.note,
  });

  // Inventory adjustment modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustData, setAdjustData] = useState<InventoryAdjustment>({
    type: undefined,
    date: new Date().toISOString().split('T')[0], // Default to today
    reason: '',
    note: '',
    relatedDocument: '',
    warehouseId: currentWarehouseId,
    inventoryAdjustmentDetails: [],
  });

  // Compute total quantity
  const totalQuantity = inventories.reduce(
    (sum, inv) => sum + inv.currentQuantity,
    0
  );

  // Set default warehouse
  React.useEffect(() => {
    if (warehouses && warehouses.length > 0 && !currentWarehouseId) {
      setCurrentWarehouseId(warehouses[0].id);
    }
  }, [warehouses]);

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

  // Sync adjustData.warehouseId with currentWarehouseId
  React.useEffect(() => {
    setAdjustData((prev) => ({
      ...prev,
      warehouseId: currentWarehouseId,
    }));
  }, [currentWarehouseId]);

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

  // Handle warehouse change
  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentWarehouseId(e.target.value);
  };

  // Handle adjustment form input changes
  const handleAdjustInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAdjustData((prev) => ({
      ...prev,
      [name]: name === 'type' ? parseInt(value) : value,
    }));
  };

  // Handle adjustment detail changes
  const handleDetailChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAdjustData((prev) => ({
      ...prev,
      inventoryAdjustmentDetails: prev.inventoryAdjustmentDetails.map(
        (detail, i) =>
          i === index
            ? {
                ...detail,
                [name]:
                  name === 'changeInQuantity' ? parseInt(value) || 0 : value,
              }
            : detail
      ),
    }));
  };

  // Add new adjustment detail
  const addDetail = () => {
    setAdjustData((prev) => ({
      ...prev,
      inventoryAdjustmentDetails: [
        ...prev.inventoryAdjustmentDetails,
        { inventoryId: '', changeInQuantity: 0, note: '' },
      ],
    }));
  };

  // Remove adjustment detail
  const removeDetail = (index: number) => {
    setAdjustData((prev) => ({
      ...prev,
      inventoryAdjustmentDetails: prev.inventoryAdjustmentDetails.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Handle adjustment form submission (placeholder)
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inventory adjustment:', adjustData);
    // TODO: Integrate useCreateInventoryAdjustment mutation here
    setIsAdjustModalOpen(false);
    setAdjustData({
      type: undefined,
      date: new Date().toISOString().split('T')[0],
      reason: '',
      note: '',
      relatedDocument: '',
      warehouseId: currentWarehouseId,
      inventoryAdjustmentDetails: [],
    });
  };

  // Open adjustment modal with pre-filled inventory
  const openAdjustModal = (inventoryId: string) => {
    setAdjustData({
      type: undefined,
      date: new Date().toISOString().split('T')[0],
      reason: '',
      note: '',
      relatedDocument: '',
      warehouseId: currentWarehouseId,
      inventoryAdjustmentDetails: [
        { inventoryId, changeInQuantity: 0, note: '' },
      ],
    });
    setIsAdjustModalOpen(true);
  };

  // Get current warehouse name
  const currentWarehouseName =
    warehouses?.find((w) => w.id === currentWarehouseId)?.name ||
    'Không xác định';

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
    <div className='container mx-auto p-4 max-w-6xl'>
      {/* Top Section: Warehouse Selection */}
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
            <p className='text-gray-600 text-sm'>
              <strong>Kho hiện tại:</strong> {currentWarehouseName}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Product and Batches */}
      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        {/* Product Details Card */}
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

        {/* Batches Card */}
        <div className='flex-1 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Danh sách lô
          </h2>
          {batches && batches.length > 0 ? (
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {batches.map((batch) => (
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
                </div>
              ))}
            </div>
          ) : (
            <div className='text-gray-600 text-center py-4'>
              Không có lô nào.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Inventory List */}
      <div className='w-full mb-4'>
        <div className='bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-lg transition-all duration-200 m-4 p-5'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Danh sách tồn kho
          </h2>
          {isInventoriesLoading ? (
            <div className='flex justify-center items-center py-4'>
              <Loader2 className='w-6 h-6 animate-spin text-blue-500' />
            </div>
          ) : inventoriesError ? (
            <div className='text-red-500 text-center py-4'>
              Lỗi tải dữ liệu tồn kho.
            </div>
          ) : inventories && inventories.length > 0 ? (
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {inventories.map((inv) => {
                const batch = batches?.find((b) => b.id === inv.batchId);
                return (
                  <div
                    key={inv.id}
                    className='border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors last:border-b-0'
                  >
                    <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3'>
                      <div>
                        <p className='text-gray-600'>
                          <strong className='text-gray-700'>Mã lô:</strong>{' '}
                          {batch?.code || 'Không xác định'}
                        </p>
                        <p className='text-gray-600'>
                          <strong className='text-gray-700'>Số lượng:</strong>{' '}
                          {inv.currentQuantity}
                        </p>
                      </div>
                      <button
                        onClick={() => openAdjustModal(inv.id || '')}
                        className='flex items-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-3xl hover:bg-blue-100 transition-colors text-sm w-full md:w-auto'
                      >
                        <Wrench className='w-4 h-4 mr-1' />
                        Điều chỉnh
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-gray-600 text-center py-4'>
              Không có tồn kho.
            </div>
          )}
        </div>
      </div>

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

      {/* Inventory Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white border border-gray-200 shadow-lg rounded-xl p-6 w-full max-w-lg md:max-w-lg m-4'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Điều chỉnh tồn kho
            </h2>
            {isInventoriesLoading ? (
              <div className='flex justify-center items-center py-4'>
                <Loader2 className='w-6 h-6 animate-spin text-blue-500' />
              </div>
            ) : inventoriesError ? (
              <div className='text-red-500 text-center py-4'>
                Lỗi tải dữ liệu tồn kho.
              </div>
            ) : (
              <form onSubmit={handleAdjustSubmit} className='space-y-4'>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Loại điều chỉnh
                  </label>
                  <select
                    name='type'
                    value={adjustData.type ?? ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    required
                  >
                    <option value=''>Chọn loại</option>
                    <option value='1'>Tăng</option>
                    <option value='2'>Giảm</option>
                  </select>
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Ngày
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={adjustData.date || ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    required
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Lý do
                  </label>
                  <input
                    type='text'
                    name='reason'
                    value={adjustData.reason || ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    placeholder='Nhập lý do điều chỉnh'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Ghi chú
                  </label>
                  <textarea
                    name='note'
                    value={adjustData.note || ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    rows={3}
                    placeholder='Nhập ghi chú'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Tài liệu liên quan
                  </label>
                  <input
                    type='text'
                    name='relatedDocument'
                    value={adjustData.relatedDocument || ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    placeholder='Nhập mã tài liệu liên quan'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>
                    Kho
                  </label>
                  <select
                    name='warehouseId'
                    value={adjustData.warehouseId || ''}
                    onChange={handleAdjustInputChange}
                    className='w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
                    required
                  >
                    <option value=''>Chọn kho</option>
                    {warehouses?.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className='flex justify-between items-center mb-2'>
                    <label className='block text-gray-700 text-sm font-medium'>
                      Chi tiết điều chỉnh
                    </label>
                    <button
                      type='button'
                      onClick={addDetail}
                      className='flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm'
                    >
                      <Plus className='w-4 h-4 mr-1' />
                      Thêm
                    </button>
                  </div>
                  {adjustData.inventoryAdjustmentDetails.length === 0 ? (
                    <p className='text-gray-600 text-sm'>
                      Chưa có chi tiết điều chỉnh.
                    </p>
                  ) : (
                    <div className='space-y-2 max-h-64 overflow-y-auto'>
                      {adjustData.inventoryAdjustmentDetails.map(
                        (detail, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-2 border border-gray-200 p-3 rounded-lg'
                          >
                            <div className='flex-1'>
                              <select
                                name='inventoryId'
                                value={detail.inventoryId || ''}
                                onChange={(e) => handleDetailChange(index, e)}
                                className='w-full border border-gray-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors text-sm'
                                required
                              >
                                <option value=''>Chọn tồn kho</option>
                                {inventories.map((inv) => {
                                  const batch = batches?.find(
                                    (b) => b.id === inv.batchId
                                  );
                                  return (
                                    <option key={inv.id} value={inv.id}>
                                      {batch?.code} (Kho: {currentWarehouseName}
                                      , Tồn: {inv.currentQuantity})
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className='flex-1'>
                              <input
                                type='number'
                                name='changeInQuantity'
                                value={detail.changeInQuantity ?? ''}
                                onChange={(e) => handleDetailChange(index, e)}
                                className='w-full border border-gray-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors text-sm'
                                placeholder='Số lượng'
                                required
                              />
                            </div>
                            <div className='flex-1'>
                              <input
                                type='text'
                                name='note'
                                value={detail.note || ''}
                                onChange={(e) => handleDetailChange(index, e)}
                                className='w-full border border-gray-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors text-sm'
                                placeholder='Ghi chú'
                              />
                            </div>
                            <button
                              type='button'
                              onClick={() => removeDetail(index)}
                              className='text-red-500 hover:text-red-700'
                            >
                              <Trash2 className='w-5 h-5' />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
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
                    onClick={() => setIsAdjustModalOpen(false)}
                    className='flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-3xl hover:bg-gray-300 transition-colors text-sm'
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

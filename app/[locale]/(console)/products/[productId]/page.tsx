'use client';
import { useProduct } from '@/hooks/queries/productQueries';
import { useBatchesByProductId } from '@/hooks/queries/batchQueries';
import { useWarehouses } from '@/hooks/queries/accountQueries';
import { useWarehousesInventoriesByProductID } from '@/hooks/queries/warehouseQueries';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import { Check, FileText, Loader2, Pencil, X } from 'lucide-react';
import { Product } from '@/types/product';
import { Link, useRouter } from '@/lib/i18n/routing';
import ProductBatchTable from '@/components/custom-table/batch/BatchProductTable';
import { Batch } from '@/types/batch';
import Loading from '@/components/app/Loading';

const ProductDetail = () => {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productIdStr = Array.isArray(productId) ? productId[0] : productId;
  const [currentWarehouseBatches, setCurrentWarehouseBatches] = useState<
    Batch[]
  >([]);
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
  const { data: inventories, isPending } = useWarehousesInventoriesByProductID(
    currentWarehouseId !== undefined,
    currentWarehouseId || '',
    productIdStr || ''
  );

  // const { data: stockCard } = useWarehousesStockCardByProductID(
  //   currentWarehouseId !== undefined,
  //   currentWarehouseId || '',
  //   productIdStr || ''
  // );

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

  useEffect(() => {
    const inventoryMap = new Map<string, number>();
    inventories?.forEach((inv) => {
      inventoryMap.set(inv.batchId || '', inv.currentQuantity);
    });
    const filteredBatches = batches
      ?.map((batch) => {
        const thisWarehouseQuantity = inventoryMap.get(batch.id);
        if (thisWarehouseQuantity !== undefined && thisWarehouseQuantity > 0) {
          return { ...batch, thisWarehouseQuantity };
        }
        return null;
      })
      .filter((batch): batch is Batch => batch !== null);
    setCurrentWarehouseBatches(filteredBatches || []);
  }, [batches, inventories]);

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
    <div className='flex flex-col p-4 gap-0'>
      <div className='flex'>
        <div className='w-full rounded-xl'>
          <div className='flex bg-gradient-to-r from-blue-950 to-primary p-5 rounded-t-xl text-white'>
            <div className='flex-1 flex flex-col'>
              <h1 className='text-2xl font-bold'>{product.name}</h1>
              <p className='text-sm text-white/80'>Mã SKU: {product.sku}</p>
            </div>
            <div className='space-y-3'>
              <div>
                <label className='text-white text-sm font-medium'>
                  Kho hiện tại
                </label>
                <select
                  value={currentWarehouseId}
                  onChange={handleWarehouseChange}
                  className='w-full border text-black font-small border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
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
          <div className='flex p-5 space-y-3 border-l-2 border-r-2 border-b-2 rounded-b-xl'>
            <div>
              <p className='text-gray-600'>
                <strong className='text-gray-700'>Đơn vị:</strong>{' '}
                {product.unit}
              </p>
              <p className='text-gray-600'>
                <strong className='text-gray-700'>Danh mục:</strong>{' '}
                {product.category || 'Không có'}
              </p>
              <p className='text-gray-600'>
                <strong className='text-gray-700'>Loại:</strong>{' '}
                {(product.productType as string) || 'Không có'}
              </p>
              <p className='text-gray-600'>
                <strong className='text-gray-700'>Mô tả:</strong>{' '}
                {product.note || 'Không có'}
              </p>
              <p className='text-gray-600'>
                <strong className='text-gray-700'>Tổng số lượng:</strong>{' '}
                {totalQuantity}
              </p>
              <p className='text-gray-600 flex'>
                <span className='text-gray-700 font-bold'>Có hạn sử dụng:</span>
                {product.isBatchManaged ? (
                  <Check className='text-green-500 ml-1' />
                ) : (
                  <X className='text-red-500 ml-1' />
                )}
              </p>
              <div className='flex mt-2 space-x-2'>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className='flex items-center bg-transparent border border-yellow-500 text-yellow-500 px-4 py-2 rounded-3xl hover:bg-yellow-100 transition-colors text-sm'
                >
                  <Pencil className='w-4 h-4' />
                  Sửa
                </button>
                <Link
                  href={`/report/stockcard?productId=${productId}&warehouseId=${currentWarehouseId}`}
                  className='flex items-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-3xl hover:bg-blue-100 transition-colors text-sm'
                >
                  <FileText className='w-4 h-4' />
                  Thẻ kho
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='font-bold text-2xl mt-4 text-center'>
        Danh sách lô thuộc sản phẩm này
      </div>
      <div className='w-full'>
        {isPending ? (
          <Loading />
        ) : (
          <ProductBatchTable batches={currentWarehouseBatches} />
        )}
      </div>

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

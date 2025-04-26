'use client';
import { useProduct } from '@/hooks/queries/productQueries';
import { useBatchesByProductId } from '@/hooks/queries/batchQueries';
import { useParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Loader2, Printer, Pencil } from 'lucide-react';
import { Product } from '@/types/product';

const ProductDetail = () => {
  const { productId } = useParams();
  const productIdStr = Array.isArray(productId) ? productId[0] : productId;
  const { data: product, isLoading, error } = useProduct(productIdStr || '');
  const { data: batches } = useBatchesByProductId(productIdStr || '');

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name,
    sku: product?.sku,
    unit: product?.unit,
    category: product?.category,
    note: product?.note,
  });

  // Update form data
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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (placeholder)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated product:', formData);
    // TODO: Integrate useUpdateProduct mutation here
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='flex justify-center items-center min-h-screen text-red-500'>
        Lỗi tải sản phẩm hoặc không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      <div className='flex flex-col md:flex-row min-h-[100vh-12rem]'>
        {/* Product Details Card (Left) */}
        <div className='flex-1 bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-[1.01] transition-transform m-2 h-full'>
          <div className='bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white'>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <p className='text-sm opacity-80'>Mã SKU: {product.sku}</p>
          </div>
          <div className='p-6 space-y-4'>
            <p>
              <strong className='text-gray-700'>Đơn vị:</strong> {product.unit}
            </p>
            <p>
              <strong className='text-gray-700'>Danh mục:</strong>{' '}
              {product.category || 'Không có'}
            </p>
            <p>
              <strong className='text-gray-700'>Mô tả:</strong>{' '}
              {product.note || 'Không có'}
            </p>
            <div className='flex space-x-4'>
              <button className='flex items-center bg-blue-500 text-white px-6 py-3 rounded-3xl hover:bg-blue-600 transition-colors'>
                <Printer className='w-5 h-5 mr-2' />
                In thẻ kho
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className='flex items-center bg-transparent border border-blue-500 text-blue-500 px-6 py-3 rounded-3xl hover:bg-blue-50 transition-colors'
              >
                <Pencil className='w-5 h-5 mr-2' />
                Sửa
              </button>
            </div>
          </div>
        </div>

        {/* Batches Card (Right) */}
        <div className='flex-1 bg-white shadow-lg rounded-lg transform hover:scale-[1.01] transition-transform m-2 h-full'>
          <div className='p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Danh sách lô
            </h2>
            {batches && batches.length > 0 ? (
              <div className='space-y-2 max-h-[calc(100vh-2rem)] overflow-y-auto'>
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    className='bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors'
                  >
                    <p>
                      <strong>Mã lô:</strong> {batch.code}
                    </p>
                    <p>
                      <strong>Hết hạn:</strong>{' '}
                      {new Date(batch.expDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-gray-500 text-center'>Không có lô nào.</div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Sửa thông tin sản phẩm
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-gray-700'>Tên sản phẩm</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700'>Mã SKU</label>
                <input
                  type='text'
                  name='sku'
                  value={formData.sku || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700'>Đơn vị</label>
                <input
                  type='text'
                  name='unit'
                  value={formData.unit || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700'>Danh mục</label>
                <input
                  type='text'
                  name='category'
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-gray-700'>Mô tả</label>
                <textarea
                  name='note'
                  value={formData.note || ''}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={4}
                />
              </div>
              <div className='flex space-x-4'>
                <button
                  type='submit'
                  className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition-colors'
                >
                  Lưu
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditModalOpen(false)}
                  className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-3xl hover:bg-gray-400 transition-colors'
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Stock Card */}
      <div ref={printRef} className='hidden print:block p-6 bg-white'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Thẻ kho: {product.name}
        </h1>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <p>
            <strong>Mã SKU:</strong> {product.sku}
          </p>
          <p>
            <strong>Đơn vị:</strong> {product.unit}
          </p>
          <p>
            <strong>Danh mục:</strong> {product.category || 'Không có'}
          </p>
          <p>
            <strong>Mô tả:</strong> {product.note || 'Không có'}
          </p>
        </div>
        {batches && batches.length > 0 && (
          <div>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>
              Danh sách lô
            </h2>
            <div className='space-y-2'>
              {batches.map((batch) => (
                <div key={batch.id}>
                  <p>
                    <strong>Mã lô:</strong> {batch.code}
                  </p>
                  <p>
                    <strong>Hết hạn:</strong>{' '}
                    {new Date(batch.expDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

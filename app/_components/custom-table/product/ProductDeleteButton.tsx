'use client';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { DeleteDialog } from '../../dialogs/DeleteDialog';
import { useDeleteProduct } from '@/lib/hooks/queries/productQueries';

interface CustomDeleteButtonProps {
  productId: string;
}

const ProductDeleteButton: React.FC<CustomDeleteButtonProps> = ({
  productId,
}: CustomDeleteButtonProps) => {
  const mutation = useDeleteProduct();

  const handleConfirmDelete = () => {
    mutation.mutate(productId);
  };

  return (
    <div>
      <DeleteDialog
        onConfirmDelete={handleConfirmDelete}
        title='Xóa sản phẩm'
        description='Bạn có chắc chắn muốn xóa sản phẩm này?'
        isLoading={mutation.isPending}
      >
        <button>
          <Trash2 className='text-red-500' size={19} />
        </button>
      </DeleteDialog>
    </div>
  );
};

export default ProductDeleteButton;

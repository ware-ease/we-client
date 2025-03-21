'use client';
import BatchDialog from '@/app/_components/dialogs/BatchDialog';
import CategoryDialog from '@/app/_components/dialogs/CategoryDialog';
import UnitDialog from '@/app/_components/dialogs/UnitDialog';
import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/_components/shadcn-base/Card';
import { Link } from '@/i18n/routing';
import { getAllCategories } from '@/lib/services/categoryService';
import {
  getBatchCount,
  getCategoryCount,
  getProductCount,
  getProductTypeCount,
} from '@/lib/services/productService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';

const ProductsHome = () => {
  const queryClient = useQueryClient();

  const { data: productCount } = useQuery({
    queryKey: ['productCount'],
    queryFn: getProductCount,
  });

  const { data: categoryCount } = useQuery({
    queryKey: ['categoryCount'],
    queryFn: getCategoryCount,
  });

  const { data: productTypeCount } = useQuery({
    queryKey: ['productTypeCount'],
    queryFn: getProductTypeCount,
  });

  const { data: batchCount } = useQuery({
    queryKey: ['batchCount'],
    queryFn: getBatchCount,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  const handleCategoriesRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['categoryCount'] });
  };

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-4'>
          <div className='text-4xl font-semibold text-primary'>
            Quản lý sản phẩm
          </div>
        </div>
        <div className='p-4 flex space-x-10'>
          <Card className='w-2/5 border-black border-2 drop-shadow-xl'>
            <CardHeader>
              <CardTitle>Danh mục sản phẩm</CardTitle>
              <div className='text-3xl font-bold'>{categoryCount ?? 0}</div>
              <CardDescription>hiện có trong ứng dụng.</CardDescription>
            </CardHeader>
            <CardFooter>
              <CategoryDialog
                categories={categories}
                onRefresh={handleCategoriesRefresh}
              >
                <button className='hover:cursor-pointer font-semibold text-blue-500'>
                  → Xem chi tiết
                </button>
              </CategoryDialog>
            </CardFooter>
          </Card>
          <Card className='w-2/5 border-black border-2 drop-shadow-xl'>
            <CardHeader>
              <CardTitle>Loại sản phẩm</CardTitle>
              <div className='text-3xl font-bold'>{productTypeCount ?? 0}</div>
              <CardDescription>hiện có trong ứng dụng.</CardDescription>
            </CardHeader>
            <CardFooter>
              {/* <ProductTypeDialog> */}
              <button className='hover:cursor-pointer font-semibold text-blue-500'>
                → Xem chi tiết
              </button>
              {/* </ProductTypeDialog> */}
            </CardFooter>
          </Card>
        </div>
        <div className='p-4 flex space-x-10'>
          <Card className='w-2/5 border-black border-2 drop-shadow-xl'>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
              <div className='text-3xl font-bold'>{productCount ?? 0}</div>
              <CardDescription>hiện có trong ứng dụng.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href='/products'
                className='hover:cursor-pointer font-semibold text-blue-500'
              >
                → Xem chi tiết
              </Link>
            </CardFooter>
          </Card>
          <Card className='w-2/5 border-black border-2 drop-shadow-xl'>
            <CardHeader>
              <CardTitle>Lô hàng</CardTitle>
              <div className='text-3xl font-bold'>{batchCount ?? 0}</div>
              <CardDescription>hiện có trong ứng dụng.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href='/batches'
                className='hover:cursor-pointer font-semibold text-blue-500'
              >
                → Xem chi tiết
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className='p-4 flex space-x-10'>
          <div className='w-2/5'>
            <BatchDialog>
              <Button className='w-full drop-shadow-xl'>
                <Settings />
                Hãng sản xuất
              </Button>
            </BatchDialog>
          </div>
          <div className='w-2/5'>
            <UnitDialog>
              <Button className='w-full drop-shadow-xl'>
                <Settings />
                Đơn vị
              </Button>
            </UnitDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHome;

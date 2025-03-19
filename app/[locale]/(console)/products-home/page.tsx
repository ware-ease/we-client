'use client';
import CategoryDialog from '@/app/_components/dialogs/CategoryDialog';
import CustomerDialog from '@/app/_components/dialogs/CustomerDialog';
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
import {
  getBatchCount,
  getCategoryCount,
  getProductCount,
  getProductTypeCount,
} from '@/lib/services/productService';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';

const ProductsHome = () => {
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
              <CategoryDialog>
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
              <Link
                href='/product-types'
                className='hover:cursor-pointer font-semibold text-blue-500'
              >
                → Xem chi tiết
              </Link>
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
            <CustomerDialog>
              <Button className='w-full drop-shadow-xl'>
                <Settings />
                Hãng sản xuất
              </Button>
            </CustomerDialog>
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

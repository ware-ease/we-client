import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/_components/shadcn-base/Card';
import { Link } from '@/i18n/routing';
import { Settings } from 'lucide-react';
import React from 'react';

const ProductsHome = () => {
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
              <div className='text-3xl font-bold'>10</div>
              <CardDescription>hiện có trong ứng dụng.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href='/categories'
                className='hover:cursor-pointer font-semibold text-blue-500'
              >
                → Xem chi tiết
              </Link>
            </CardFooter>
          </Card>
          <Card className='w-2/5 border-black border-2 drop-shadow-xl'>
            <CardHeader>
              <CardTitle>Loại sản phẩm</CardTitle>
              <div className='text-3xl font-bold'>25</div>
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
              <div className='text-3xl font-bold'>46</div>
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
              <div className='text-3xl font-bold'>78</div>
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
            <Button className='w-full drop-shadow-xl'>
              <Settings />
              Hãng sản xuất
            </Button>
          </div>
          <div className='w-2/5'>
            <Button className='w-full drop-shadow-xl'>
              <Settings />
              Đơn vị
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHome;

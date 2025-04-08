'use client';
import { Link } from '@/lib/i18n/routing';
import {
  BarChart,
  Box,
  FileText,
  List,
  Truck,
  User,
  Users,
} from 'lucide-react';

const Home = () => {
  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>Trang chủ</div>

          {/* Quản lý kho */}
          <div className='flex flex-col p-4 gap-6 max-h-[80vh] overflow-y-auto'>
            <div className='p-4 text-xl text-primary'>
              <h2 className='text-2xl font-semibold mb-4'>Quản lý kho</h2>
              <div className='grid grid-cols-3 gap-4'>
                <Link href='/warehouses' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Box className='text-red-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Kho hàng
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Xem và quản lý các kho hàng
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href='/products-home' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <List className='text-orange-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Sản phẩm
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Quản lý danh sách sản phẩm
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href='/requests' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <FileText className='text-blue-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Yêu cầu
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Theo dõi các yêu cầu nhập/xuất hàng
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quản lý khác */}
            <div className='p-4 text-xl text-primary'>
              <h2 className='text-2xl font-semibold mb-4'>Quản lý khác</h2>
              <div className='grid grid-cols-3 gap-4'>
                <Link href='/dashboard' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <BarChart className='text-purple-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Bảng điều khiển
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Xem tổng quan và báo cáo
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href='/accounts' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <User className='text-green-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Tài khoản
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Quản lý tài khoản người dùng
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href='/suppliers' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Truck className='text-blue-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Nhà cung cấp
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Quản lý danh sách nhà cung cấp
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href='/customers' className='group'>
                  <div className='h-full bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Users className='text-orange-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        Khách hàng
                      </h2>
                      <p className='text-sm text-gray-500'>
                        Quản lý danh sách khách hàng
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

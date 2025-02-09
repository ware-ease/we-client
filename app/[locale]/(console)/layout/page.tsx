import {
  BarChart,
  Box,
  Calendar,
  Clock,
  FileText,
  List,
  Truck,
  User,
} from 'lucide-react';

const Layout = () => {
  return (
    <div className='flex flex-col space-y-4 p-8'>
      <div className='text-4xl font-semibold text-primary'>Dịch vụ nhân sự</div>
      <div className='grid grid-cols-3 gap-4'>
        {/**/}
        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <Calendar className='text-blue-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Quản lý công việc</h2>
            <p className='text-sm text-gray-500'>
              Quản lý danh sách công việc cần thực hiện, đã thực hiện
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <Clock className='text-green-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Quản lý ngày nghỉ</h2>
            <p className='text-sm text-gray-500'>
              Cán bộ nhân viên đăng ký nghỉ theo quy định
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <FileText className='text-orange-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Bảng công</h2>
            <p className='text-sm text-gray-500'>
              Thông tin công việc cá nhân của nhân viên
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <User className='text-purple-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Phiếu lương</h2>
            <p className='text-sm text-gray-500'>
              Thông tin lương, thưởng theo kỳ công
            </p>
          </div>
        </div>

        {/**/}
        <div className='col-span-3 text-4xl font-semibold text-primary mt-6'>
          Quản lý kho hàng
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <Box className='text-red-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Quản lý hàng hóa</h2>
            <p className='text-sm text-gray-500'>
              Theo dõi và quản lý danh sách sản phẩm trong kho
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <Truck className='text-green-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Nhập kho</h2>
            <p className='text-sm text-gray-500'>
              Quản lý việc nhập hàng hóa vào kho
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <Truck className='text-blue-500 w-6 h-6 rotate-180' />
          <div>
            <h2 className='font-medium'>Xuất kho</h2>
            <p className='text-sm text-gray-500'>
              Quản lý việc xuất hàng hóa ra khỏi kho
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <List className='text-orange-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Kiểm kê kho</h2>
            <p className='text-sm text-gray-500'>
              Quản lý số lượng và tình trạng hàng tồn kho
            </p>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4'>
          <BarChart className='text-purple-500 w-6 h-6' />
          <div>
            <h2 className='font-medium'>Báo cáo kho</h2>
            <p className='text-sm text-gray-500'>
              Xem báo cáo tổng quan về tình trạng kho hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

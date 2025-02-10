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
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Home = () => {
  const t = useTranslations();
  const language = t('Languages.this'); // Lấy ngôn ngữ hiện tại

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            {t('Home.home')}
          </div>

          {/* Warehouse Management */}
          <div className='flex flex-col p-4 gap-6 max-h-[80vh] overflow-y-auto'>
            <div className='p-4 text-xl text-primary'>
              <h2 className='text-2xl font-semibold mb-4'>
                {t('Home.warehouse')}
              </h2>
              <div className='grid grid-cols-3 gap-4'>
                <Link href={`/${language}/warehouse`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Box className='text-red-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.goods')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.goodsTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/warehouse/in`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Truck className='text-green-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.warehousing')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.warehousingTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/warehouse/out`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Truck className='text-blue-500 w-6 h-6 rotate-180' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.out')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.outTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href={`/${language}/warehouse/inventory`}
                  className='group'
                >
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <List className='text-orange-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.inventory')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.inventoryTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/warehouse/report`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <BarChart className='text-purple-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.report')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.reportTitle')}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Other */}
            <div className='p-4 text-xl text-primary'>
              <h2 className='text-2xl font-semibold mb-4'>{t('Home.other')}</h2>
              <div className='grid grid-cols-3 gap-4'>
                <Link href={`/${language}/tasks`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Calendar className='text-blue-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.tasks')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.tasksTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/leave`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <Clock className='text-green-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.leave')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.leaveTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/attendance`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <FileText className='text-orange-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.attendance')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.attendanceTitle')}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href={`/${language}/payroll`} className='group'>
                  <div className='bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-gray-100 transition'>
                    <User className='text-purple-500 w-6 h-6' />
                    <div>
                      <h2 className='font-medium group-hover:underline'>
                        {t('Home.payroll')}
                      </h2>
                      <p className='text-sm text-gray-500'>
                        {t('Home.payrollTitle')}
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

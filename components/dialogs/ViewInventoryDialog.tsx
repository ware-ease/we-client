import { Card, CardContent } from '../shadcn-base/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../shadcn-base/Dialog';
import { Label } from '../shadcn-base/Label';
import { Separator } from '../shadcn-base/Separator';

const inventoryData = {
  currentQuantity: 197,
  arrangedQuantity: null,
  notArrgangedQuantity: null,
  warehouse: {
    name: 'Kho Sài Gòn',
    phone: '01234345869',
    address: 'Quận 3, Thành phố Hồ Chí Minh',
    latitude: 10.78235378,
    longitude: 106.68648041,
    area: 1000,
    operateFrom: '2025-03-20T06:45:00',
  },
  batch: {
    code: 'B20250509-1',
    name: 'Test',
    mfgDate: '2025-05-09',
    expDate: '2025-05-27',
    inboundDate: '2025-05-09',
    product: {
      sku: 'CDVCUONDD',
      name: 'Dây điện Cadivi',
      unitName: 'Cuộn',
      brandName: 'Cadivi',
    },
  },
};

const ViewInventoryDialog = () => {
  const {
    currentQuantity,
    arrangedQuantity,
    notArrgangedQuantity,
    warehouse,
    batch,
  } = inventoryData;

  return (
    <Dialog open>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Chi tiết tồn kho</DialogTitle>
        </DialogHeader>
        <Separator className='my-2' />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Thông tin sản phẩm */}
          <Card>
            <CardContent className='p-4 space-y-2'>
              <h3 className='font-semibold text-lg'>Sản phẩm</h3>
              <div>
                <Label>Tên:</Label> {batch.product.name}
              </div>
              <div>
                <Label>SKU:</Label> {batch.product.sku}
              </div>
              <div>
                <Label>Thương hiệu:</Label> {batch.product.brandName}
              </div>
              <div>
                <Label>Đơn vị:</Label> {batch.product.unitName}
              </div>
            </CardContent>
          </Card>

          {/* Thông tin lô */}
          <Card>
            <CardContent className='p-4 space-y-2'>
              <h3 className='font-semibold text-lg'>Lô hàng</h3>
              <div>
                <Label>Mã lô:</Label> {batch.code}
              </div>
              <div>
                <Label>Tên:</Label> {batch.name}
              </div>
              <div>
                <Label>NSX:</Label> {batch.mfgDate}
              </div>
              <div>
                <Label>HSD:</Label> {batch.expDate}
              </div>
              <div>
                <Label>Ngày nhập kho:</Label> {batch.inboundDate}
              </div>
            </CardContent>
          </Card>

          {/* Thông tin kho */}
          <Card>
            <CardContent className='p-4 space-y-2'>
              <h3 className='font-semibold text-lg'>Kho</h3>
              <div>
                <Label>Tên:</Label> {warehouse.name}
              </div>
              <div>
                <Label>Điện thoại:</Label> {warehouse.phone}
              </div>
              <div>
                <Label>Địa chỉ:</Label> {warehouse.address}
              </div>
              <div>
                <Label>Diện tích:</Label> {warehouse.area} m²
              </div>
              <div>
                <Label>Bắt đầu hoạt động:</Label>{' '}
                {new Date(warehouse.operateFrom).toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>

          {/* Số lượng */}
          <Card>
            <CardContent className='p-4 space-y-2'>
              <h3 className='font-semibold text-lg'>Số lượng</h3>
              <div>
                <Label>Hiện có:</Label> {currentQuantity}
              </div>
              <div>
                <Label>Đã sắp xếp:</Label>{' '}
                {arrangedQuantity ?? 'Chưa có thông tin'}
              </div>
              <div>
                <Label>Chưa sắp xếp:</Label>{' '}
                {notArrgangedQuantity ?? 'Chưa có thông tin'}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInventoryDialog;

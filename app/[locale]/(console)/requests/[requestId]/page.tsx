'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn-base/Button';
import CustomTable, { RowData } from '@/components/custom-table/CustomTable';
import WarehouseComboBox from '@/components/combo-boxes/WarehouseComboBox';
import useFormData from '@/hooks/useFormData';
import { GoodRequest } from '@/types/goodRequest';
import {
  useGoodRequest,
  useUpdateGoodRequest,
} from '@/hooks/queries/goodRequests';
import RequestTypeComboBox from '@/components/combo-boxes/RequestTypeComboBox';
import PartnerComboBox from '@/components/combo-boxes/PartnerComboBox';
import { useParams } from 'next/navigation';

const RequestDetail = () => {
  const { requestId } = useParams();
  const [data, setData] = useState<RowData[]>([]);
  const { formData, handleChange, setFormData } = useFormData<GoodRequest>({
    id: requestId as string,
    requestType: 0,
    partnerName: '',
    code: '',
    note: '',
    partnerId: '',
    warehouseId: '',
    requestedWarehouseId: '',
    goodRequestDetails: [],
  });

  const { mutate } = useUpdateGoodRequest();

  const { data: goodRequest } = useGoodRequest(true, requestId as string);

  useEffect(() => {
    if (goodRequest) {
      setFormData(goodRequest);
    }
  }, [goodRequest, setFormData]);

  const initialData: RowData[] | undefined =
    goodRequest?.goodRequestDetails?.map((detail) => ({
      id: detail.id || '',
      sku: detail.sku || '',
      productId: detail.productId || '',
      name: detail.productName || '',
      unit: detail.unitName || '',
      quantity: detail.quantity || 0,
      batch: '',
      batchId: '',
      note: '',
      expDate: '',
      mfgDate: '',
    }));

  const handleSubmit = () => {
    const finalFormData = {
      id: requestId as string,
      note: formData.note,
      code: formData.code,
      partnerId: formData.partnerId,
      warehouseId: formData.warehouseId,
      requestedWarehouseId: formData.requestedWarehouseId,
      goodRequestDetails: data.map((row) => ({
        quantity: row.quantity,
        productId: row.productId,
      })),
    };

    console.log(finalFormData);

    mutate(finalFormData);
  };

  const handlePartnerSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      partnerId: value,
    }));
  };

  const handleWarehouseSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedWarehouseId: value,
    }));
  };

  const handleRequestTypeSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestType: parseInt(value),
    }));
  };

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-4'>
      <div className='flex flex-col w-full'>
        <div className='flex space-x-20 items-center w-full'>
          <div className='text-4xl font-semibold text-primary'>Sửa yêu cầu</div>
        </div>
        <div className='flex space-x-20 py-5 pl-3'>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Mã yêu cầu</div>
              <Input
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='text-sm'>
              <div className='text-sm'>Loại yêu cầu:</div>
              <RequestTypeComboBox
                value={formData.requestType?.toString() ?? ''}
                onChange={(value) => handleRequestTypeSelect(value)}
                disabled
              />
            </div>

            <div className='w-64 text-sm'>
              {formData.requestType !== 2 && (
                <div>
                  <div className='text-sm'>
                    {formData.requestType === 0 ? 'Nhà cung cấp' : 'Khách hàng'}
                  </div>
                  <PartnerComboBox
                    value={formData.partnerId ?? ''}
                    onChange={(value) => handlePartnerSelect(value)}
                    partnerType={formData.requestType === 0 ? 0 : 1}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Kho nhận yêu cầu</div>
              <WarehouseComboBox
                value={formData.requestedWarehouseId ?? ''}
                onChange={(value) => handleWarehouseSelect(value)}
              />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Diễn giải</div>
              <Input
                name='note'
                value={formData.note}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <CustomTable
          isRequestDetails
          initialData={initialData}
          onDataChange={setData}
        />
      </div>
      <div className='flex w-full'>
        <div className='grow'></div>
        <Button onClick={handleSubmit}>Sửa yêu cầu</Button>
      </div>
    </div>
  );
};

export default RequestDetail;

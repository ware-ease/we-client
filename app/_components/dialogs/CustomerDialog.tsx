'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import {
  useAddCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/lib/hooks/queries/customerQueries';
import { Customer } from '@/lib/types/customer';
import { Check, Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';

interface CustomerDialogProps {
  children: ReactNode;
}

const CustomerDialog = ({ children }: CustomerDialogProps) => {
  const { data: customers, isPending } = useCustomers();
  const addCustomerMutation = useAddCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<
    Customer[] | undefined
  >(customers);
  const [newCustomer, setNewCustomer] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const [editedEmail, setEditedEmail] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!customers) return;

    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(value)
    );

    setFilteredCustomers(filtered);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer.id);
    setEditedName(customer.name);
  };
  const handleSaveEdit = (id: string) => {
    updateCustomerMutation.mutate({ id, name: editedName, email: editedEmail });
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setEditedName('');
  };

  const handleConfirmDelete = () => {
    deleteCustomerMutation.mutate(customerToDelete);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý khách hàng
          </DialogTitle>
        </DialogHeader>

        {/* Form thêm khách hàng */}
        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='customer-name' className='text-red-600'>
              Tên khách hàng *
            </Label>
            <Input
              id='customer-name'
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder='Nhập tên khách hàng...'
              className='mt-1'
            />

            <Label htmlFor='customer-email' className='mt-2 text-red-600'>
              Email khách hàng *
            </Label>
            <Input
              id='customer-email'
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
              placeholder='Nhập email khách hàng...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                onClick={() => {
                  if (!newCustomer || !newCustomerEmail) {
                    toast.error('Vui lòng nhập đầy đủ thông tin khách hàng.');
                    return;
                  }
                  addCustomerMutation.mutate({
                    name: newCustomer,
                    email: newCustomerEmail,
                  });
                  setNewCustomer('');
                  setNewCustomerEmail('');
                }}
                disabled={addCustomerMutation.isPending}
              >
                {addCustomerMutation.isPending ? 'Đang lưu...' : 'Lưu và chọn'}
              </Button>
              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Thêm khách hàng mới
          </Button>
        )}

        {/* Thanh tìm kiếm */}
        <div className='relative mt-3'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm khách hàng...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        {/* Danh sách khách hàng */}
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách khách hàng
          </h3>
          <ul className='mt-2 space-y-2'>
            {isPending ? (
              <p className='text-gray-500 text-sm text-center'>Đang tải...</p>
            ) : filteredCustomers && filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <li
                  key={customer.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingCustomer === customer.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder='Nhập tên khách hàng...'
                      />
                      <Input
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        placeholder='Nhập email khách hàng...'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(customer.id)}
                      />
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{customer.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditCustomer(customer)}
                          />
                          <DeleteDialog
                            onConfirmDelete={handleConfirmDelete}
                            title='Xóa thương hiệu'
                            description='Bạn có chắc chắn muốn xóa thương hiệu này không?'
                            isLoading={deleteCustomerMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setCustomerToDelete(customer.id);
                              }}
                            />
                          </DeleteDialog>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))
            ) : (
              <p className='text-gray-500 text-sm text-center'>
                Không có khách hàng nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;

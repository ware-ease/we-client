'use client';

import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import {
  useAddCustomer,
  useCustomers,
  useUpdateCustomer,
} from '@/hooks/queries/customerQueries';
import { Customer } from '@/types/customer';
import { Edit, Search, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CustomerDialogProps {
  children: ReactNode;
}

const CustomerDialog = ({ children }: CustomerDialogProps) => {
  const { data: customers, isPending } = useCustomers();
  const addCustomerMutation = useAddCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  // const deleteCustomerMutation = useDeleteCustomer();

  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<
    Customer[] | undefined
  >(customers);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<Partial<Customer>>({});

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

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
    setNewCustomer(customer);
    setShowForm(true);
  };

  const handleSaveCustomer = () => {
    if (!newCustomer.name?.trim() || !newCustomer.phone?.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng.');
      return;
    }

    if (newCustomer.id) {
      updateCustomerMutation.mutate(
        {
          id: newCustomer.id,
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email || 'default@example.com',
        },
        {
          onSuccess: () => {
            setShowForm(false);
          },
          onError: () => {
            toast.error('Không thể cập nhật khách hàng.');
          },
        }
      );
    } else {
      addCustomerMutation.mutate(
        {
          name: newCustomer.name,
          phone: newCustomer.phone || '',
          email: 'default@example.com',
        },
        {
          onSuccess: () => {
            setShowForm(false);
            setNewCustomer({
              name: '',
              phone: '',
            });
          },
          onError: () => {
            toast.error('Không thể thêm khách hàng.');
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setEditedCustomer({});
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

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label htmlFor='customer-name' className='text-red-600'>
                Tên khách hàng *
              </Label>
              <Input
                id='customer-name'
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                placeholder='Nhập tên khách hàng...'
                className='mt-1'
              />
            </div>

            <div className='mt-2'>
              <Label htmlFor='customer-phone' className='text-red-600'>
                Số điện thoại *
              </Label>
              <Input
                id='customer-phone'
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                placeholder='Nhập số điện thoại khách hàng...'
                className='mt-1'
              />
            </div>

            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveCustomer}>
                {newCustomer.id ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewCustomer({
                    name: '',
                    phone: '',
                  });
                  setShowForm(false);
                }}
              >
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
                        value={editedCustomer.name || ''}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            name: e.target.value,
                          })
                        }
                        className='flex-1'
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
                          {/* <DeleteDialog
                            onConfirmDelete={() =>
                              deleteCustomerMutation.mutate(customer.id)
                            }
                            title='Xóa khách hàng'
                            description='Bạn có chắc chắn muốn xóa khách hàng này không?'
                            isLoading={deleteCustomerMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {}}
                            />
                          </DeleteDialog> */}
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

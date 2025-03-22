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
  useAddBatch,
  useBatches,
  useDeleteBatch,
  useUpdateBatch,
} from '@/lib/hooks/queries/batchQueries';
import { Batch } from '@/lib/types/batch';
import { Edit, Search, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteDialog } from './DeleteDialog';

interface BatchDialogProps {
  children: ReactNode;
  productId: string;
}
const BatchDialog = ({ children, productId }: BatchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const batchesQuery = useBatches();
  const batches = batchesQuery.data || [];
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>(batches);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    code: '',
    name: '',
    mfgDate: '',
    expDate: '',
    productId,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingBatch, setEditingBatch] = useState<string | null>(null);
  const [editedBatch, setEditedBatch] = useState<Partial<Batch>>({});
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const addBatchMutation = useAddBatch();
  const updateBatchMutation = useUpdateBatch();
  const deleteBatchMutation = useDeleteBatch();

  useEffect(() => {
    setFilteredBatches(batches);
  }, [batches]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredBatches(
      batches.filter((batch) =>
        batch.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleEditBatch = (batch: Batch) => {
    setNewBatch(batch); // Gán batch hiện tại vào newBatch để chỉnh sửa
    setShowForm(true); // Hiển thị form
  };

  const handleSaveBatch = () => {
    if (!newBatch.code?.trim() || !newBatch.name?.trim()) {
      toast.error('Vui lòng nhập thông tin lô hàng hợp lệ.');
      return;
    }

    if (newBatch.id) {
      updateBatchMutation.mutate(
        { id: newBatch.id, batch: newBatch as Batch },
        {
          onSuccess: () => {
            toast.success('Cập nhật lô hàng thành công!');
            setShowForm(false);
          },
          onError: () => {
            toast.error('Không thể cập nhật lô hàng.');
          },
        }
      );
    } else {
      addBatchMutation.mutate({ ...newBatch, productId } as Batch, {
        onSuccess: () => {
          toast.success('Thêm lô hàng thành công!');
          setShowForm(false);
          setNewBatch({ code: '', name: '', mfgDate: '', expDate: '' });
        },
        onError: () => {
          toast.error('Không thể thêm lô hàng.');
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBatch(null);
    setEditedBatch({});
  };

  const handleDeleteBatch = () => {
    if (!batchToDelete) return;
    deleteBatchMutation.mutate(batchToDelete.id!, {
      onSuccess: () => {
        toast.success('Xóa lô hàng thành công!');
      },
      onError: () => toast.error('Không thể xóa lô hàng.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý lô hàng</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <div>
              <Label className='text-red-600'>Mã lô hàng *</Label>
              <Input
                value={newBatch.code}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, code: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label className='text-red-600'>Tên lô hàng *</Label>
              <Input
                value={newBatch.name}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, name: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ngày sản xuất</Label>
              <Input
                type='date'
                value={newBatch.mfgDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, mfgDate: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div>
              <Label>Ngày hết hạn</Label>
              <Input
                type='date'
                value={newBatch.expDate}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, expDate: e.target.value })
                }
                className='bg-white'
              />
            </div>
            <div className='flex justify-end mt-3 space-x-2'>
              <Button onClick={handleSaveBatch}>
                {newBatch.id ? 'Lưu thay đổi' : 'Lưu và chọn'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setNewBatch({ code: '', name: '', mfgDate: '', expDate: '' });
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
            + Tạo lô hàng mới
          </Button>
        )}

        <div className='relative'>
          <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
          <Input
            type='text'
            placeholder='Tìm kiếm lô hàng...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>
        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách lô hàng
          </h3>
          <ul className='mt-2 space-y-2'>
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch, index) => (
                <li
                  key={batch.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingBatch === batch.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedBatch.name || ''}
                        onChange={(e) =>
                          setEditedBatch({
                            ...editedBatch,
                            name: e.target.value,
                          })
                        }
                        className='flex-1'
                      />
                      {/* <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(batch.id)}
                      /> */}
                      <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{batch.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditBatch(batch)}
                          />

                          <DeleteDialog
                            onConfirmDelete={handleDeleteBatch}
                            title='Xóa lô hànghàng'
                            description='Bạn có chắc chắn muốn xóa lô hàng này không?'
                            isLoading={deleteBatchMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setBatchToDelete(batch);
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
                Không có lô hàng nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDialog;

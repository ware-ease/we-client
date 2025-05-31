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
  useAddCategory,
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/queries/categoryQueries';
import { Category } from '@/types/category';
import { Check, Edit, Search, Trash2 } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { DeleteDialog } from './DeleteDialog';

interface CategoryDialogProps {
  children: ReactNode;
}

const CategoryDialog = ({ children }: CategoryDialogProps) => {
  const { data: categories, isPending } = useCategories();
  const addCategoryMutation = useAddCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<
    Category[] | undefined
  >([]);
  const [newCategory, setNewCategory] = useState<Category | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  console.log(categories);
  console.log(searchTerm);
  console.log(filteredCategories);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (!categories) return;
    setFilteredCategories(
      categories.filter((category) =>
        category?.name?.toLowerCase().includes(value)
      )
    );
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id ?? '');
    setEditedName(category.name ?? '');
  };

  const handleSaveEdit = (id: string) => {
    updateCategoryMutation.mutate({ id, name: editedName });
    setEditingCategory(null);
  };

  // const handleCancelEdit = () => {
  //   setEditingCategory(null);
  //   setEditedName('');
  // };

  const handleConfirmDelete = () => {
    deleteCategoryMutation.mutate(categoryToDelete);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Quản lý danh mục
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className='border p-4 rounded-md bg-gray-50'>
            <Label htmlFor='category-name' className='text-red-600'>
              Tên danh mục*
            </Label>
            <Input
              value={newCategory?.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
              placeholder='Nhập tên danh mục...'
              className='mt-1'
            />
            <div className='flex justify-end mt-3 space-x-2'>
              <Button
                onClick={() => addCategoryMutation.mutate(newCategory ?? {})}
                disabled={addCategoryMutation.isPending}
              >
                {addCategoryMutation.isPending ? 'Đang lưu...' : 'Lưu và chọn'}
              </Button>

              <Button variant='secondary' onClick={() => setShowForm(false)}>
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className='w-full bg-green-500 text-white'
            onClick={() => setShowForm(true)}
          >
            + Tạo danh mục mới
          </Button>
        )}

        <div className='relative mb-3'>
          <Search className='absolute left-3 top-3 text-gray-400 h-4 w-4' />
          <Input
            type='text'
            placeholder='Tìm kiếm danh mục...'
            value={searchTerm}
            onChange={handleSearch}
            className='pl-9'
          />
        </div>

        <div className='border rounded-md p-3 max-h-60 overflow-auto'>
          <h3 className='text-sm font-semibold text-gray-600'>
            Danh sách danh mục
          </h3>
          <ul className='mt-2 space-y-2'>
            {isPending ? (
              <p className='text-gray-500 text-sm text-center'>Đang tải...</p>
            ) : filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <li
                  key={category.id}
                  className='flex justify-between items-center p-2 border rounded-md transition-all duration-300 hover:bg-gray-100'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {editingCategory === category.id ? (
                    <div className='flex items-center space-x-2 w-full'>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className='flex-1'
                      />
                      <Check
                        className='text-green-600 h-5 w-5 cursor-pointer'
                        onClick={() => handleSaveEdit(category.id ?? '')}
                      />
                      {/* <X
                        className='text-gray-600 h-5 w-5 cursor-pointer'
                        onClick={handleCancelEdit}
                      /> */}
                    </div>
                  ) : (
                    <>
                      <span className='text-gray-700'>{category.name}</span>
                      {hoveredIndex === index && (
                        <div className='flex space-x-2'>
                          <Edit
                            className='text-blue-600 h-4 w-4 cursor-pointer'
                            onClick={() => handleEditCategory(category)}
                          />
                          <DeleteDialog
                            onConfirmDelete={handleConfirmDelete}
                            title='Xóa danh mục'
                            description='Bạn có chắc chắn muốn xóa danh mục này không?'
                            isLoading={deleteCategoryMutation.isPending}
                          >
                            <Trash2
                              className='text-red-600 h-4 w-4 cursor-pointer'
                              onClick={() => {
                                setCategoryToDelete(category.id ?? '');
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
                Không có danh mục nào.
              </p>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;

'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import { ScrollArea } from '@/app/_components/shadcn-base/ScrollArea';
import { Edit, Plus, SortAsc, SortDesc, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

const Groups = ({ onSelect }: { onSelect: (item: string) => void }) => {
  // State quản lý nhóm và các modal
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [newGroupName, setNewGroupName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState('');
  const [editedGroupName, setEditedGroupName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Khởi tạo danh sách nhóm ban đầu
  useEffect(() => {
    setGroups(['Admin', 'HR', 'Finance', 'IT']);
  }, []);

  // Chọn nhóm mặc định
  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroup(groups[0]);
      onSelect(groups[0]);
    }
  }, [groups]);

  // Lọc và sắp xếp nhóm
  const filteredGroups = groups
    .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    );

  // Thêm nhóm mới
  const addGroup = () => {
    if (newGroupName.trim() && !groups.includes(newGroupName)) {
      setGroups([...groups, newGroupName]);
      setNewGroupName('');
      setIsDialogOpen(false);
    }
  };

  // Xóa nhóm
  const deleteGroup = () => {
    setGroups(groups.filter((group) => group !== groupToDelete));
    setIsDeleteDialogOpen(false);
  };

  // Sửa nhóm
  const editGroup = () => {
    if (
      editedGroupName.trim() &&
      groupToEdit &&
      editedGroupName !== groupToEdit
    ) {
      setGroups(
        groups.map((group) => (group === groupToEdit ? editedGroupName : group))
      );
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div>
      <div className='flex items-center gap-2 mb-4'>
        <Input
          placeholder='Search groups...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant='outline'
          size='icon'
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? (
            <SortAsc className='h-5 w-5' />
          ) : (
            <SortDesc className='h-5 w-5' />
          )}
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className='h-5 w-5' />
        </Button>
      </div>
      <ScrollArea className='h-[575px]'>
        {filteredGroups.map((group) => (
          <div
            key={group}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer w-full ${
              selectedGroup === group
                ? 'bg-primary text-white'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedGroup(group);
              onSelect(group);
            }}
          >
            <span>{group}</span>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupToEdit(group);
                  setEditedGroupName(group);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className='h-4 w-4 text-blue-500' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupToDelete(group);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className='h-4 w-4 text-red-500' />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Dialog thêm nhóm */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='w-full max-w-md'>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <Label htmlFor='newGroup'>Group Name</Label>
          <Input
            id='newGroup'
            placeholder='Enter group name'
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>
            <Button onClick={addGroup}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xóa nhóm */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='w-full max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the group{' '}
            <span className='font-bold'>{groupToDelete}</span>?
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>
            <Button variant='destructive' onClick={deleteGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog sửa nhóm */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='w-full max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <Label htmlFor='editGroup'>New Group Name</Label>
          <Input
            id='editGroup'
            placeholder='Enter new group name'
            value={editedGroupName}
            onChange={(e) => setEditedGroupName(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>
            <Button onClick={editGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;

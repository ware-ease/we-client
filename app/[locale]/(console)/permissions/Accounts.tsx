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

const Accounts = ({ onSelect }: { onSelect: (item: string) => void }) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [newAccountName, setNewAccountName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState('');
  const [editedAccountName, setEditedAccountName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setAccounts(['admin', 'john.doe', 'jane.smith', 'guest']);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
      onSelect(accounts[0]);
    }
  }, [accounts]);

  const filteredAccounts = accounts
    .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    );

  const addAccount = () => {
    if (newAccountName.trim() && !accounts.includes(newAccountName)) {
      setAccounts([...accounts, newAccountName]);
      setNewAccountName('');
      setIsDialogOpen(false);
    }
  };

  const deleteAccount = () => {
    setAccounts(accounts.filter((account) => account !== accountToDelete));
    setIsDeleteDialogOpen(false);
  };

  const editAccount = () => {
    if (
      editedAccountName.trim() &&
      accountToEdit &&
      editedAccountName !== accountToEdit
    ) {
      setAccounts(
        accounts.map((account) =>
          account === accountToEdit ? editedAccountName : account
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div>
      <div className='flex items-center gap-2 mb-4'>
        <Input
          placeholder='Search accounts...'
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='w-full max-w-md'>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Label htmlFor='newAccount'>Account Name</Label>
              <Input
                id='newAccount'
                placeholder='Enter account name'
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>
              <Button onClick={addAccount}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className='h-full'>
        {filteredAccounts.map((account) => (
          <div
            key={account}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer w-full ${
              selectedAccount === account
                ? 'bg-primary text-white'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedAccount(account);
              onSelect(account);
            }}
          >
            <span>{account}</span>
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountToEdit(account);
                  setEditedAccountName(account);
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
                  setAccountToDelete(account);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash className='h-4 w-4 text-red-500' />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Dialog xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='w-full max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>
              Are you sure you want to delete the account{' '}
              <span className='font-bold'>{accountToDelete}</span>?
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>
            <Button variant='destructive' onClick={deleteAccount}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='w-full max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Label htmlFor='editAccount'>New Account Name</Label>
            <Input
              id='editAccount'
              placeholder='Enter new account name'
              value={editedAccountName}
              onChange={(e) => setEditedAccountName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>
            <Button onClick={editAccount}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;

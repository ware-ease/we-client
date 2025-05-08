'use client';
import React from 'react';
import UpdateAccountStatusDialog from '../dialogs/UpdateAccountStatusDialog';

interface StatusUIProps {
  status: number;
  accountId: string;
  username: string;
}

const AccountStatusUI: React.FC<StatusUIProps> = ({
  status,
  accountId,
  username,
}) => {
  console.log(status);
  return (
    <UpdateAccountStatusDialog
      accountId={accountId}
      username={username}
      currentStatus={status}
    />
  );
};

export default AccountStatusUI;

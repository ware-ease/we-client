import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn-base/Card';

type RevenueCardProps = {
  title: string;
  amount: string;
  percentageChange: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const BaseCard: FC<RevenueCardProps> = ({
  title,
  amount,
  percentageChange,
  icon: Icon,
}) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{amount}</div>
        <p className='text-xs text-muted-foreground'>{percentageChange}</p>
      </CardContent>
    </Card>
  );
};

export default BaseCard;

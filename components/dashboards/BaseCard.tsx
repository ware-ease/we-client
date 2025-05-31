import { LucideIcon } from 'lucide-react';
import { Card } from '../shadcn-base/Card';

interface BaseCardProps {
  title: string;
  amount: string;
  percentageChange: string;
  icon: LucideIcon;
  iconClass?: string;
}

const BaseCard = ({
  title,
  amount,
  percentageChange,
  icon: Icon,
  iconClass,
}: BaseCardProps) => {
  const formatPercentageChange = (change: string) => {
    if (change === '...') return change;
    
    // Extract the number from the string using regex
    const match = change.match(/(-?\d+(\.\d+)?)/);
    if (!match) return change;
    
    const number = parseFloat(match[0]);
    const isNegative = number < 0;
    const absoluteNumber = Math.abs(number);
    
    return {
      text: `${isNegative ? 'Giảm' : 'Tăng'} ${absoluteNumber}% so với tháng trước`,
      isNegative
    };
  };

  const percentageInfo = formatPercentageChange(percentageChange);
  const percentageText = typeof percentageInfo === 'string' 
    ? percentageInfo 
    : percentageInfo.text;
  const textColorClass = typeof percentageInfo === 'string' 
    ? '' 
    : percentageInfo.isNegative ? 'text-red-500' : 'text-green-500';

  return (
    <Card>
      <div className='flex h-full flex-col gap-3 p-6'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>{title}</span>
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
        <div>
          <div className='text-2xl font-bold'>{amount}</div>
          <p className={`text-xs ${textColorClass}`}>
            {percentageText}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BaseCard;

import { Card, Text, Flex } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './ComparisonBlock.scss';

export type ComparisonBlockProps = {
    title: string;
    current: number;
    previous: number;
    formatValue?: (value: number | string) => string;
};

const cn = block('comparison-block');

export const ComparisonBlock = ({title, current, previous, formatValue}: ComparisonBlockProps) => {
    const difference = current - previous;
    const percentChange = previous !== 0 
        ? ((current - previous) / Math.abs(previous)) * 100 
        : 0;
    
    const isPositive = difference > 0;
    const isNegative = difference < 0;
    const isNeutral = difference === 0;
    
    const formattedCurrent = formatValue ? formatValue(current) : current;
    const formattedPrevious = formatValue ? formatValue(previous) : previous;
    const formattedDifference = formatValue ? formatValue(difference) : difference.toString();

    return (
        <Card view={'filled'} theme={'utility'} className={cn()}>
            <div className={cn('title')}>{title}</div>
            <div className={cn('value')}>{formattedCurrent}</div>
            
            <Flex alignItems="center" className={cn('comparison')}>
                <div 
                    className={cn('triangle', {
                        positive: isPositive,
                        negative: isNegative,
                        neutral: isNeutral
                    })}
                >
                    {isPositive && '▲'}
                    {isNegative && '▼'}
                    {isNeutral && '—'}
                </div>
                <div 
                    className={cn('difference', {
                        positive: isPositive,
                        negative: isNegative,
                        neutral: isNeutral
                    })}
                >
                    {isPositive && '+'}
                    {formattedDifference} ({percentChange.toFixed(1)}%)
                </div>
            </Flex>
            
            <div className={cn('previous')}>
                Предыдущий: {formattedPrevious}
            </div>
        </Card>
    );
};
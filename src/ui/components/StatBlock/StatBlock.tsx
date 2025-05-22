import { Card, Text, Flex } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './StatBlock.scss';

export type StatBlockProps = {
    value?: string | number;
    title?: string;
    previousValue?: string | number;
    formatValue?: (value: number | string) => string;
};

const cn = block('stat-block');

export const StatBlock = ({value, title, previousValue, formatValue}: StatBlockProps) => {
    const hasComparison = previousValue !== undefined;
    
    let difference = 0;
    let percentChange = 0;
    let isPositive = false;
    let isNegative = false;
    let isNeutral = true;
    
    if (hasComparison && value !== undefined && previousValue !== undefined) {
        const currentNum = typeof value === 'string' ? parseFloat(value) : value;
        const previousNum = typeof previousValue === 'string' ? parseFloat(previousValue) : previousValue;
        
        if (!isNaN(currentNum) && !isNaN(previousNum)) {
            difference = currentNum - previousNum;
            percentChange = previousNum !== 0
                ? ((currentNum - previousNum) / Math.abs(previousNum)) * 100
                : 0;
            
            isPositive = difference > 0;
            isNegative = difference < 0;
            isNeutral = difference === 0;
        }
    }
    
    const formattedDifference = formatValue
        ? formatValue(difference)
        : difference.toString();

    return (
        <Card view={'filled'} theme={'utility'} className={cn()}>
            <div className={cn('title')}>{title}</div>
            <div className={cn('value')}>{value}</div>
            
            {hasComparison && (
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
            )}
        </Card>
    )
};
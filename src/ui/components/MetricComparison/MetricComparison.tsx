import { FC } from 'react';
import { Card, Flex, Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './MetricComparison.scss';

export type MetricComparisonProps = {
    title: string;
    currentValue: number;
    previousValue: number;
    formatValue?: (value: number) => string;
};

const cn = block('metric-comparison');

export const MetricComparison: FC<MetricComparisonProps> = ({
    title,
    currentValue,
    previousValue,
    formatValue = (value) => String(value),
}) => {
    const difference = currentValue - previousValue;
    const percentChange = previousValue !== 0 
        ? ((currentValue - previousValue) / Math.abs(previousValue)) * 100 
        : 0;
    
    const isPositive = difference > 0;
    const isNegative = difference < 0;
    const isNeutral = difference === 0;
    
    return (
        <Card view={'filled'} theme={'utility'} className={cn()}>
            <div className={cn('title')}>{title}</div>
            <div className={cn('value')}>{formatValue(currentValue)}</div>
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
                    {formatValue(difference)} ({percentChange.toFixed(1)}%)
                </div>
            </Flex>
        </Card>
    );
};
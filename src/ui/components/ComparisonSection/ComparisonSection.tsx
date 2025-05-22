import { FC } from 'react';
import { Flex, Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './ComparisonSection.scss';
import { MetricComparison } from '../MetricComparison/MetricComparison';

export type ComparisonSectionProps = {
    title: string;
    comparison?: {
        impressions: { current: number; previous: number; title: string };
        clicks: { current: number; previous: number; title: string };
        cost: { current: number; previous: number; title: string };
        conversions: { current: number; previous: number; title: string };
    };
    formatCost: (cost: number) => string;
};

const cn = block('comparison-section');

export const ComparisonSection: FC<ComparisonSectionProps> = ({
    title,
    comparison,
    formatCost,
}) => {
    if (!comparison) {
        return null;
    }

    return (
        <Flex direction={'column'} className={cn()}>
            <Text variant='subheader-2' className={cn('title')}>{title}</Text>
            <Flex className={cn('metrics')}>
                <MetricComparison
                    title={comparison.impressions.title}
                    currentValue={comparison.impressions.current}
                    previousValue={comparison.impressions.previous}
                />
                <MetricComparison
                    title={comparison.clicks.title}
                    currentValue={comparison.clicks.current}
                    previousValue={comparison.clicks.previous}
                />
                <MetricComparison
                    title={comparison.cost.title}
                    currentValue={comparison.cost.current}
                    previousValue={comparison.cost.previous}
                    formatValue={formatCost}
                />
                <MetricComparison
                    title={comparison.conversions.title}
                    currentValue={comparison.conversions.current}
                    previousValue={comparison.conversions.previous}
                />
            </Flex>
        </Flex>
    );
};
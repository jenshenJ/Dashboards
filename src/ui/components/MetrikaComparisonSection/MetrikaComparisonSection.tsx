import { FC } from 'react';
import { Flex, Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import './MetrikaComparisonSection.scss';
import { MetricComparison } from '../MetricComparison/MetricComparison';

export type MetrikaComparisonSectionProps = {
    title: string;
    metrika?: {
        CTR: { value: string | number, title: string },
        CPC: { value: string | number, title: string },
        CPM: { value: string | number, title: string },
        Conversions?: { value: string | number, title: string },
    };
    previousMetrika?: {
        CTR: { value: string | number, title: string },
        CPC: { value: string | number, title: string },
        CPM: { value: string | number, title: string },
        Conversions?: { value: string | number, title: string },
    };
    formatCost: (cost: number) => string;
};

const cn = block('metrika-comparison-section');

export const MetrikaComparisonSection: FC<MetrikaComparisonSectionProps> = ({
    title,
    metrika,
    previousMetrika,
    formatCost,
}) => {
    if (!metrika || !previousMetrika) {
        return null;
    }

    return (
        <Flex direction={'column'} className={cn()}>
            <Text variant='subheader-2' className={cn('title')}>{title}</Text>
            <Flex className={cn('metrics')}>
                <MetricComparison
                    title={metrika.CTR.title}
                    currentValue={Number(metrika.CTR.value)}
                    previousValue={Number(previousMetrika.CTR.value)}
                />
                <MetricComparison
                    title={metrika.CPC.title}
                    currentValue={Number(metrika.CPC.value)}
                    previousValue={Number(previousMetrika.CPC.value)}
                    formatValue={formatCost}
                />
                <MetricComparison
                    title={metrika.CPM.title}
                    currentValue={Number(metrika.CPM.value)}
                    previousValue={Number(previousMetrika.CPM.value)}
                />
                {metrika.Conversions && previousMetrika.Conversions && (
                    <MetricComparison
                        title={metrika.Conversions.title}
                        currentValue={Number(metrika.Conversions.value)}
                        previousValue={Number(previousMetrika.Conversions.value)}
                    />
                )}
            </Flex>
        </Flex>
    );
};
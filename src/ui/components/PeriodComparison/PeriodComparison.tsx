import { FC, useState, useCallback } from 'react';
import { Flex, Text, Button } from '@gravity-ui/uikit';
import { RangeDatePicker } from '@gravity-ui/date-components';
import block from 'bem-cn-lite';
import './PeriodComparison.scss';
import { MetricChart } from '../MetricChart/MetricChart';

export type PeriodComparisonProps = {
    onCompare: (startDate1: string, endDate1: string, startDate2: string, endDate2: string) => void;
    data1?: any[];
    data2?: any[];
    googleChecked: boolean;
    yandexChecked: boolean;
    formatCost: (cost: number | string | (number | string)[]) => string;
};

const cn = block('period-comparison');

export const PeriodComparison: FC<PeriodComparisonProps> = ({
    onCompare,
    data1,
    data2,
    googleChecked,
    yandexChecked,
    formatCost,
}) => {
    const [startDate1, setStartDate1] = useState<string>();
    const [endDate1, setEndDate1] = useState<string>();
    const [startDate2, setStartDate2] = useState<string>();
    const [endDate2, setEndDate2] = useState<string>();
    const [isComparing, setIsComparing] = useState(false);

    const handleDateRange1Change = useCallback((value: any) => {
        if (value) {
            setStartDate1(value.start.add(1, 'day').toISOString().split('T')[0]);
            setEndDate1(value.end.toISOString().split('T')[0]);
        } else {
            setStartDate1(undefined);
            setEndDate1(undefined);
        }
    }, []);

    const handleDateRange2Change = useCallback((value: any) => {
        if (value) {
            setStartDate2(value.start.add(1, 'day').toISOString().split('T')[0]);
            setEndDate2(value.end.toISOString().split('T')[0]);
        } else {
            setStartDate2(undefined);
            setEndDate2(undefined);
        }
    }, []);

    const handleCompare = useCallback(() => {
        if (startDate1 && endDate1 && startDate2 && endDate2) {
            onCompare(startDate1, endDate1, startDate2, endDate2);
            setIsComparing(true);
        }
    }, [startDate1, endDate1, startDate2, endDate2, onCompare]);

    return (
        <Flex direction="column" className={cn()}>
            <Text variant="header-2">Сравнение периодов</Text>
            
            <Flex className={cn('controls')}>
                <Flex direction="column" className={cn('period')}>
                    <Text variant="subheader-1">Период 1</Text>
                    <RangeDatePicker
                        hasClear
                        size="l"
                        style={{ width: 240 }}
                        format="DD/MM/YYYY"
                        onUpdate={handleDateRange1Change}
                    />
                </Flex>
                
                <Flex direction="column" className={cn('period')}>
                    <Text variant="subheader-1">Период 2</Text>
                    <RangeDatePicker
                        hasClear
                        size="l"
                        style={{ width: 240 }}
                        format="DD/MM/YYYY"
                        onUpdate={handleDateRange2Change}
                    />
                </Flex>
                
                <Button
                    view="action"
                    size="l"
                    onClick={handleCompare}
                    disabled={!startDate1 || !endDate1 || !startDate2 || !endDate2}
                >
                    Сравнить
                </Button>
            </Flex>
            
            {isComparing && data1 && data2 && (
                <Flex direction="column" className={cn('results')}>
                    <Text variant="subheader-2">Результаты сравнения</Text>
                    
                    <Flex className={cn('charts')}>
                        <Flex direction="column" className={cn('chart-group')}>
                            <Text variant="subheader-3">Показы</Text>
                            <Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 1</Text>
                                    <MetricChart
                                        title=""
                                        data={data1}
                                        dataKeyGoogle="google_impressions"
                                        dataKeyYandex="direct_impressions"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        tooltipLabel="Показы"
                                    />
                                </Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 2</Text>
                                    <MetricChart
                                        title=""
                                        data={data2}
                                        dataKeyGoogle="google_impressions"
                                        dataKeyYandex="direct_impressions"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        tooltipLabel="Показы"
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                        
                        <Flex direction="column" className={cn('chart-group')}>
                            <Text variant="subheader-3">Клики</Text>
                            <Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 1</Text>
                                    <MetricChart
                                        title=""
                                        data={data1}
                                        dataKeyGoogle="google_clicks"
                                        dataKeyYandex="direct_clicks"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        tooltipLabel="Клики"
                                    />
                                </Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 2</Text>
                                    <MetricChart
                                        title=""
                                        data={data2}
                                        dataKeyGoogle="google_clicks"
                                        dataKeyYandex="direct_clicks"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        tooltipLabel="Клики"
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                        
                        <Flex direction="column" className={cn('chart-group')}>
                            <Text variant="subheader-3">Бюджет</Text>
                            <Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 1</Text>
                                    <MetricChart
                                        title=""
                                        data={data1}
                                        dataKeyGoogle="google_cost"
                                        dataKeyYandex="direct_cost"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        formatValue={formatCost}
                                        tooltipLabel="Бюджет"
                                    />
                                </Flex>
                                <Flex direction="column" className={cn('chart')}>
                                    <Text variant="caption-1">Период 2</Text>
                                    <MetricChart
                                        title=""
                                        data={data2}
                                        dataKeyGoogle="google_cost"
                                        dataKeyYandex="direct_cost"
                                        googleChecked={googleChecked}
                                        yandexChecked={yandexChecked}
                                        formatValue={formatCost}
                                        tooltipLabel="Бюджет"
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};
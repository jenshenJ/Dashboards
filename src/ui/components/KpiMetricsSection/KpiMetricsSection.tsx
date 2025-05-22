import { FC, useState, useCallback } from 'react';
import { Card, Flex, Text, RadioGroup } from '@gravity-ui/uikit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import block from 'bem-cn-lite';
import './KpiMetricsSection.scss';

export type MetricData = {
    name: string;
    value: number;
    previousValue: number;
    color?: string;
};

export type KpiMetricsSectionProps = {
    title: string;
    metrics: MetricData[];
    dailyData?: any[];
    formatValue?: (value: number) => string;
    googleChecked: boolean;
    yandexChecked: boolean;
    onGoogleChange: (checked: boolean) => void;
    onYandexChange: (checked: boolean) => void;
};

const cn = block('kpi-metrics-section');

export const KpiMetricsSection: FC<KpiMetricsSectionProps> = ({
    title,
    metrics,
    dailyData = [],
    formatValue = (value) => String(value),
    googleChecked,
    yandexChecked,
    onGoogleChange,
    onYandexChange
}) => {
    const [selectedMetric, setSelectedMetric] = useState<string>(metrics[0]?.name || '');

    const handleMetricChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMetric(event.target.value);
    }, []);

    // Format date for X-axis
    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'numeric' }).format(date);
    };


    return (
        <Card className={cn()}>
            <Text variant="header-2" className={cn('title')}>{title}</Text>
            
            <Flex className={cn('platform-selector')}>
                <label className={cn('platform-label')}>
                    <input
                        type="checkbox"
                        checked={googleChecked}
                        onChange={(e) => onGoogleChange(e.target.checked)}
                    />
                    Google
                </label>
                <label className={cn('platform-label')}>
                    <input
                        type="checkbox"
                        checked={yandexChecked}
                        onChange={(e) => onYandexChange(e.target.checked)}
                    />
                    Yandex
                </label>
            </Flex>
            
            <Flex className={cn('metrics-container')}>
                {metrics.map((metric) => {
                    const difference = metric.value - metric.previousValue;
                    const percentChange = metric.previousValue !== 0 
                        ? ((metric.value - metric.previousValue) / Math.abs(metric.previousValue)) * 100 
                        : 0;
                    
                    const isPositive = difference > 0;
                    const isNegative = difference < 0;
                    const isNeutral = difference === 0;
                    
                    return (
                        <Card
                            key={metric.name}
                            view="filled"
                            theme="utility"
                            className={cn('metric-card')}
                        >
                            <Text className={cn('metric-title')}>{metric.name}</Text>
                            <Flex alignItems="center" className={cn('value-row')}>
                                <Text className={cn('metric-value')}>
                                    {metric.name === "CTR" ? `${metric.value.toFixed(2)}%` :
                                     (metric.name === "CPC" || metric.name === "CPM") ? `${metric.value.toFixed(2)}₽` :
                                     metric.name === "Конверсии" ? `${Math.round(metric.value)}` :
                                     formatValue(metric.value)}
                                </Text>
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
                                        {metric.name === "CTR" ? `${difference.toFixed(2)}%` :
                                         (metric.name === "CPC" || metric.name === "CPM") ? `${difference.toFixed(2)}₽` :
                                         metric.name === "Конверсии" ? `${Math.round(difference)}` :
                                         formatValue(difference)} {metric.name !== "Конверсии" && `(${percentChange.toFixed(1)}%)`}
                                    </div>
                                </Flex>
                            </Flex>
                        </Card>
                    );
                })}
            </Flex>
            
            {dailyData.length > 0 && (
                <div className={cn('chart-container')}>
                    <Text className={cn('chart-title')}>Динамика показателей по дням</Text>
                    <Flex className={cn('chart-controls')}>
                        <RadioGroup
                            size="m"
                            value={selectedMetric}
                            onChange={handleMetricChange}
                        >
                            {metrics.map((metric) => (
                                <RadioGroup.Option
                                    key={metric.name}
                                    value={metric.name}
                                    content={metric.name}
                                />
                            ))}
                        </RadioGroup>
                    </Flex>
                    
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={dailyData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                stroke="#666"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#666"
                                tick={{ fontSize: 12 }}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                                    padding: '10px 14px'
                                }}
                                itemStyle={{
                                    color: '#333',
                                    fontSize: '14px',
                                    padding: '4px 0'
                                }}
                                labelStyle={{
                                    fontWeight: 'bold',
                                    marginBottom: '6px',
                                    color: '#000',
                                    borderBottom: '1px solid #eee',
                                    paddingBottom: '6px'
                                }}
                                formatter={(value, name) => {
                                    // Format based on metric name
                                    if (name === "CTR") {
                                        return [`${Number(value).toFixed(2)}%`, name];
                                    } else if (name === "CPC" || name === "CPM") {
                                        return [`${Number(value).toFixed(2)}₽`, name];
                                    } else if (name === "Конверсии") {
                                        return [`${Math.round(Number(value))}`, name];
                                    } else {
                                        return [formatValue(Number(value)), name];
                                    }
                                }}
                                labelFormatter={(label) => formatXAxis(label)}
                                cursor={{ stroke: '#4a00e0', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            <Line
                                type="monotone"
                                dataKey={selectedMetric}
                                stroke="#4a00e0"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#4a00e0", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 7, fill: "#4a00e0", strokeWidth: 2, stroke: "#fff" }}
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
};
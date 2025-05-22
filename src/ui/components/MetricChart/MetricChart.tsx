import { FC } from 'react';
import { Text } from '@gravity-ui/uikit';
import './MetricChart.scss';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export type MetricChartProps = {
    title: string;
    data?: any[];
    dataKeyGoogle: string;
    dataKeyYandex: string;
    googleChecked: boolean;
    yandexChecked: boolean;
    formatValue?: (value: number | string | (number | string)[]) => string;
    tooltipLabel: string;
};

const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatCabinet = (value: string | number) => {
    const cabinet = String(value).split('_')[0];

    if (cabinet === 'google') {
        return '(Google)';
    } else if (cabinet === 'direct') {
        return '(Yandex)'
    } else {
        return '';
    }
}

export const MetricChart: FC<MetricChartProps> = ({
    title,
    data,
    dataKeyGoogle,
    dataKeyYandex,
    googleChecked,
    yandexChecked,
    formatValue,
    tooltipLabel,
}) => {
    return (
        <div className="metric-chart">
            <Text variant='subheader-3'>{title}</Text>
            <ResponsiveContainer width={400} height={300}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date"
                        tickFormatter={formatXAxis} 
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(label) => `${formatXAxis(label)}`}
                        formatter={(value, name) => [
                            formatValue ? formatValue(value) : value, 
                            `${tooltipLabel} ${formatCabinet(name)}`
                        ]}
                    />
                    {googleChecked && <Area type="monotone" dataKey={dataKeyGoogle} stroke="#4a00e0" fill="#4a00e0" />}
                    {yandexChecked && <Area type="monotone" dataKey={dataKeyYandex} stroke="#4caf50" fill="#4caf50" />}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
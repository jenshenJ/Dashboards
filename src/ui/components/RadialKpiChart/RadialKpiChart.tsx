import { FC, useMemo } from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Flex, Text, Table } from '@gravity-ui/uikit';
import './RadialKpiChart.scss';

export type RadialKpiChartProps = {
    kpiData: any[][];
    formatCost: (cost: number | string | (number | string)[]) => string;
};

export const RadialKpiChart: FC<RadialKpiChartProps> = ({ kpiData, formatCost }) => {
    const chartData = useMemo(() => {
        if (!kpiData || kpiData.length < 3) return [];

        // Extract data from kpiData
        const impressions = kpiData[0][0];
        const clicks = kpiData[1][0];
        const budget = kpiData[2][0];

        // Calculate percentages
        const impressionsPercentage = Math.round((impressions.real / impressions.expected) * 100);
        const clicksPercentage = Math.round((clicks.real / clicks.expected) * 100);
        const budgetPercentage = Math.round((budget.real / budget.expected) * 100);

        // Calculate average percentage for the center
        const averagePercentage = Math.round((impressionsPercentage + clicksPercentage + budgetPercentage) / 3);

        // Prepare data for the radial chart
        return [
            {
                name: 'Конверсии',
                value: 100,
                fill: '#4169E1',
                percentage: 100,
                expected: 0,
                real: 0,
                display: false
            },
            {
                name: 'Показы',
                value: impressionsPercentage,
                fill: '#4169E1',
                percentage: impressionsPercentage,
                expected: impressions.expected,
                real: impressions.real,
                display: true
            },
            {
                name: 'Клики',
                value: clicksPercentage,
                fill: '#2E8B57',
                percentage: clicksPercentage,
                expected: clicks.expected,
                real: clicks.real,
                display: true
            },
            {
                name: 'Бюджет',
                value: budgetPercentage,
                fill: '#B8860B',
                percentage: budgetPercentage,
                expected: budget.expected,
                real: budget.real,
                display: true,
                isMonetary: true
            },
            {
                averagePercentage
            }
        ];
    }, [kpiData]);

    const tableData = useMemo(() => {
        if (chartData.length === 0) return [];
        
        return chartData
            .filter(item => item.display)
            .map(item => ({
                metric: item.name,
                plan: item.isMonetary ? formatCost(item.expected) : item.expected,
                fact: item.isMonetary ? formatCost(item.real) : item.real,
                percentage: `${item.percentage}%`
            }));
    }, [chartData, formatCost]);

    if (!kpiData || kpiData.length < 3) {
        return null;
    }

    const averagePercentage = chartData[chartData.length - 1]?.averagePercentage || 0;

    return (
        <Flex className="radial-kpi-chart">
            <div className="radial-kpi-chart__chart-container">
                <div className="radial-kpi-chart__percentage-container">
                    <Text variant="display-1" className="radial-kpi-chart__percentage">
                        {averagePercentage}%
                    </Text>
                </div>
                <RadialBarChart
                    width={280}
                    height={280}
                    innerRadius="35%"
                    outerRadius="90%"
                    data={chartData.filter(item => item.display)} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <RadialBar
                        background
                        dataKey="value"
                        label={false}
                    />
                    <Tooltip 
                        formatter={(value, name) => [`${value}%`, name]}
                    />
                </RadialBarChart>
            </div>
            
            <Table
                className="radial-kpi-chart__table"
                columns={[
                    { id: 'metric', name: 'Метрика' },
                    { id: 'plan', name: 'План' },
                    { id: 'fact', name: 'Факт' },
                    { id: 'percentage', name: 'Динамика' }
                ]}
                data={tableData}
            />
        </Flex>
    );
};
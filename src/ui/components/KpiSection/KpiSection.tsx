import { FC } from 'react';
import { Flex, Text } from '@gravity-ui/uikit';
import './KpiSection.scss';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StatBlock } from '@/ui/components/StatBlock/StatBlock';

export type KpiSectionProps = {
    title: string;
    kpiData?: any[][];
    metrika?: {
        CTR: { value?: string | number; title?: string };
        CPC: { value?: string | number; title?: string };
        CPM: { value?: string | number; title?: string };
        Conversions?: { value?: string | number; title?: string };
    };
    formatCost: (cost: number | string | (number | string)[]) => string;
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

export const KpiSection: FC<KpiSectionProps> = ({
    title,
    kpiData,
    metrika,
    formatCost,
}) => {
    if (!kpiData || !metrika) {
        return null;
    }

    return (
        <Flex direction={'column'} className="kpi-section">
            <Text variant='subheader-2' className="kpi-section__title">{title}</Text>
            <Flex className="kpi-section__charts">
                <BarChart
                    data={kpiData[0]}
                    width={240}
                    height={280}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#666" />
                    <Tooltip
                        formatter={(value, name, item) => [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                            padding: '10px 14px'
                        }}
                    />
                    <Legend
                        payload={[
                            { value: 'План', type: 'square', color: '#4a00e0' },
                            { value: 'Факт', type: 'square', color: '#4caf50' }
                        ]}
                        verticalAlign="top"
                        align="center"
                    />
                    <Bar name="План" dataKey="expected" fill="#4a00e0" barSize={50} radius={[6, 6, 0, 0]} />
                    <Bar name="Факт" dataKey="real" fill="#4caf50" barSize={50} radius={[6, 6, 0, 0]} />
                </BarChart>
                <BarChart
                    data={kpiData[1]}
                    width={240}
                    height={280}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#666" />
                    <Tooltip
                        formatter={(value, name, item) => [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                            padding: '10px 14px'
                        }}
                    />
                    <Legend
                        payload={[
                            { value: 'План', type: 'square', color: '#4a00e0' },
                            { value: 'Факт', type: 'square', color: '#4caf50' }
                        ]}
                        verticalAlign="top"
                        align="center"
                    />
                    <Bar name="План" dataKey="expected" fill="#4a00e0" barSize={50} radius={[6, 6, 0, 0]} />
                    <Bar name="Факт" dataKey="real" fill="#4caf50" barSize={50} radius={[6, 6, 0, 0]} />
                </BarChart>
                <BarChart
                    data={kpiData[2]}
                    width={240}
                    height={280}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#666" />
                    <Tooltip
                        formatter={(value, name, item) => [`${formatCost(value)}`, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                            padding: '10px 14px'
                        }}
                    />
                    <Legend
                        payload={[
                            { value: 'План', type: 'square', color: '#4a00e0' },
                            { value: 'Факт', type: 'square', color: '#4caf50' }
                        ]}
                        verticalAlign="top"
                        align="center"
                    />
                    <Bar name="План" dataKey="expected" fill="#4a00e0" barSize={50} radius={[6, 6, 0, 0]} />
                    <Bar name="Факт" dataKey="real" fill="#4caf50" barSize={50} radius={[6, 6, 0, 0]} />
                </BarChart>
            </Flex>
        </Flex>
    );
};
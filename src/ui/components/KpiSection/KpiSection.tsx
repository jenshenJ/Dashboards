import { FC } from 'react';
import { Flex, Text } from '@gravity-ui/uikit';
import './KpiSection.scss';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
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
                    width={200}
                    height={200}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip formatter={(value, name, item) => [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                    <Bar dataKey="expected" fill="#8884d8" />
                    <Bar dataKey="real" fill="#82ca9d" />
                </BarChart>
                <BarChart
                    data={kpiData[1]}
                    width={200}
                    height={200}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip formatter={(value, name, item) => [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                    <Bar dataKey="expected" fill="#8884d8" />
                    <Bar dataKey="real" fill="#82ca9d" />
                </BarChart>
                <BarChart
                    data={kpiData[2]}
                    width={200}
                    height={200}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip formatter={(value, name, item) => [`${formatCost(value)}`, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                    <Bar dataKey="expected" fill="#8884d8" />
                    <Bar dataKey="real" fill="#82ca9d" />
                </BarChart>
                <StatBlock value={metrika.CTR.value} title={metrika.CTR.title}/>
                <StatBlock value={formatCost(metrika.CPC.value || 0)} title={metrika.CPC.title}/>
                <StatBlock value={metrika.CPM.value} title={metrika.CPM.title}/>
                {metrika.Conversions && <StatBlock value={metrika.Conversions.value} title={metrika.Conversions.title}/>}
            </Flex>
        </Flex>
    );
};
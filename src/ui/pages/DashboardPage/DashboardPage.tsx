import { useCallback, useEffect, useState } from 'react';

import { DefaultPage } from '@/ui/pages/DefaultPage/DefaultPage';
import { Checkbox, Flex, Select, SelectOption, Text } from '@gravity-ui/uikit';
import { RangeDatePicker, RangeValue } from '@gravity-ui/date-components';
import { dateTimeParse, dateTime, DateTime } from '@gravity-ui/date-utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Rectangle, Legend, BarChart, Bar } from 'recharts';

import block from 'bem-cn-lite';

import { sdk } from "@/sdk";

import { StatBlock } from '@/ui/components/StatBlock/StatBlock';

import './DashboardPage.scss';
import { Company } from '@/sdk/types/company';
import { useParams, useSearchParams } from 'react-router-dom';


const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const formatCost = (cost: number | string | (number | string)[]) => {
    const [rubles, cents] = String(cost).split('.');
    return `${rubles}р ${cents || 0}коп`;
}

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

const cn = block('dashboard');

export const DashboardPage = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesOptions, setCompaniesOptions] = useState<{content: string, value: string}[]>([]);
    const [selectedOption, setSelectedOption] = useState<{content: string, value: string}>();
    const [currentCompany, setCurrentCompany] = useState<Company>();

    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const [yandexChecked, setYandexChechked] = useState(true);
    const [googleChecked, setGooogleChecked] = useState(true);

    const getOptions = (companies: Company[]) => {
        const result = [];

        for(const company of companies) {
            result.push({content: company.text, value: company.id})
        }

        return [...result];
    }

    console.log(companies);

    useEffect(() => {
        void sdk.getCompanies({startDate, endDate, userId: id || undefined}).then((response) => {
            setCompanies(response.data.companies);
            setCurrentCompany(response.data.companies[0])

            const options = getOptions(response.data.companies);

            setCompaniesOptions(options);
            setSelectedOption(options[0])
        });
    }, [setCompanies, setCurrentCompany, setCompaniesOptions, startDate, endDate, id])


    const handleUpdateCompany = useCallback((newValue: string[]) => {
        console.log(newValue);
        console.log(companies);

        setSelectedOption(companiesOptions.find((option) => option.value === newValue[0]));
        console.log(companies.find(company => company.id === newValue[0]));
        setCurrentCompany(companies.find(company => company.id === newValue[0]));
    }, [setSelectedOption, setCurrentCompany, companies]);

    return (
        <DefaultPage title={'Дашборд кампании'}>
            <Flex className={cn('controls')}>
                <Flex direction={'column'}>
                    <Text variant='subheader-1'>{'Выберите промежуток'}</Text>
                    <RangeDatePicker
                        hasClear
                        size='l'
                        style={{width: 240}}
                        format='DD/MM/YYYY'
                        onUpdate={
                            (value) => {
                                setStartDate(value?.start.add(1, 'day').toISOString().split('T')[0]);
                                setEndDate(value?.end.toISOString().split('T')[0]);
                            }       
                        }
                    />
                </Flex>
                <Flex alignItems={'end'}>
                    <Select onUpdate={handleUpdateCompany} placeholder={"Выберите компанию"} size="l" value={[selectedOption?.content || '']} options={companiesOptions}/>
                </Flex>
                <Flex alignItems={'end'} gap={4}>
                    <Checkbox checked={yandexChecked} onUpdate={setYandexChechked} size={'l'} content={'Яндекс.Директ'}/>
                    <Checkbox checked={googleChecked} onUpdate={setGooogleChecked} size={'l'} content={'Google Ads'}/>
                </Flex>
            </Flex>
            <Flex style={{marginBottom: 20}}>
                <div>
                    <Text variant='subheader-3'>Показы</Text> 
                    <ResponsiveContainer width={450} height={300}>
                        <AreaChart
                            data={currentCompany?.data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <div>{'title'}</div>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date"
                                tickFormatter={formatXAxis} 
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(label) => `${formatXAxis(label)}`}
                                formatter={(value, name) => [`${value}`, `Показы ${formatCabinet(name)}`]}
                            />
                            { googleChecked && <Area type="monotone" dataKey="google_impressions" stroke="#8884d8" fill="#8884d8" /> }
                            { yandexChecked && <Area type="monotone" dataKey="direct_impressions" stroke="#ffc658" fill="#ffc658"  /> }
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <Text variant='subheader-3'>Клики</Text>
                    <ResponsiveContainer width={450} height={300}>
                        <AreaChart
                            data={currentCompany?.data}
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
                                formatter={(value, name) => [`${value}`, `Клики ${formatCabinet(name)}`]}
                            />
                            { googleChecked && <Area type="monotone" dataKey="google_clicks" stroke="#8884d8" fill="#8884d8" /> }
                            { yandexChecked &&<Area type="monotone" dataKey="direct_clicks" stroke="#ffc658" fill="#ffc658" /> }
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <Text variant='subheader-3'>Бюджет</Text>
                    <ResponsiveContainer width={450} height={300}>
                        <AreaChart
                            data={currentCompany?.data}
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
                                formatter={(value, name) => [`${formatCost(value)}`, `Бюджет ${formatCabinet(name)}`]}
                            />
                            { googleChecked && <Area type="monotone" dataKey="google_cost" stroke="#8884d8" fill="#8884d8" /> }
                            { yandexChecked &&<Area type="monotone" dataKey="direct_cost" stroke="#ffc658" fill="#ffc658" /> }
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Flex>
            <Text variant='header-2'>KPI</Text>
            { googleChecked &&
                <Flex direction={'column'}>
                    <Text variant='subheader-2'>Google</Text>
                    <Flex>
                        <BarChart
                            data={currentCompany?.kpiDataGoogle[0]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <BarChart
                            data={currentCompany?.kpiDataGoogle[1]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <BarChart
                            data={currentCompany?.kpiDataGoogle[2]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [`${formatCost(value)}`, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <StatBlock value={currentCompany?.metrika.google.CTR.value} title={currentCompany?.metrika.google.CTR.title }/>
                        <StatBlock value={formatCost(currentCompany?.metrika.google.CPC.value || 0)} title={currentCompany?.metrika.google.CPC.title}/>
                        <StatBlock value={currentCompany?.metrika.google.CPM.value} title={currentCompany?.metrika.google.CPM.title}/>
                    </Flex>
                </Flex>
            }
            { yandexChecked &&
                <Flex direction={'column'}>
                    <Text variant='subheader-2'>Yandex</Text>
                    <Flex>
                        <BarChart
                            data={currentCompany?.kpiDataDirect[0]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <BarChart
                            data={currentCompany?.kpiDataDirect[1]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [value, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <BarChart
                            data={currentCompany?.kpiDataDirect[2]}
                            width={200}
                            height={200}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value, name, item) =>  [`${formatCost(value)}`, `${item.dataKey === 'expected' ? 'План' : 'Текущий' } ${formatCabinet(name)}`]} />
                            <Bar dataKey="expected" fill="#8884d8" />
                            <Bar dataKey="real" fill="#82ca9d" />
                        </BarChart>
                        <StatBlock value={currentCompany?.metrika.direct.CTR.value} title={currentCompany?.metrika.direct.CTR.title }/>
                        <StatBlock value={formatCost(currentCompany?.metrika.direct.CPC.value || 0)} title={currentCompany?.metrika.direct.CPC.title}/>
                        <StatBlock value={currentCompany?.metrika.direct.CPM.value} title={currentCompany?.metrika.direct.CPM.title}/>
                    </Flex>
                </Flex>
            }
        </DefaultPage>
    );
};

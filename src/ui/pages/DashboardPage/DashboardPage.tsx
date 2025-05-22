import { useCallback, useEffect, useState } from 'react';
import { DefaultPage } from '@/ui/pages/DefaultPage/DefaultPage';
import { Flex, Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import { sdk } from "@/sdk";
import { Company } from '@/sdk/types/company';
import { useSearchParams } from 'react-router-dom';
import { ComparisonSection } from '@/ui/components/ComparisonSection/ComparisonSection';

// Import our new components
import { DashboardControls } from '@/ui/components/DashboardControls/DashboardControls';
import { MetricChart } from '@/ui/components/MetricChart/MetricChart';
import { KpiSection } from '@/ui/components/KpiSection/KpiSection';
import { CompanyComments } from '@/ui/components/CompanyComments/CompanyComments';
import { CompanyComment } from '@/sdk/types/company';

import './DashboardPage.scss';

const cn = block('dashboard');

// Utility function for formatting cost
const formatCost = (cost: number | string | (number | string)[]) => {
    const [rubles, cents] = String(cost).split('.');
    // Take only first two digits of kopecks (cents)
    const formattedCents = cents ? cents.substring(0, 2) : '00';
    return `${rubles}р ${formattedCents}коп`;
}

export const DashboardPage = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesOptions, setCompaniesOptions] = useState<{content: string, value: string}[]>([]);
    const [selectedOption, setSelectedOption] = useState<{content: string, value: string}>();
    const [currentCompany, setCurrentCompany] = useState<Company>();

    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const [yandexChecked, setYandexChecked] = useState(true);
    const [googleChecked, setGoogleChecked] = useState(true);
    
    // Comments state
    const [comments, setComments] = useState<CompanyComment[]>([]);
    

    const getOptions = (companies: Company[]) => {
        const result = [];

        for(const company of companies) {
            result.push({content: company.text, value: company.id})
        }

        return [...result];
    }

    useEffect(() => {
        void sdk.getCompanies({startDate, endDate, userId: id || undefined}).then((response) => {
            setCompanies(response.data.companies);
            setCurrentCompany(response.data.companies[0])

            const options = getOptions(response.data.companies);

            setCompaniesOptions(options);
            setSelectedOption(options[0])
        });
    }, [setCompanies, setCurrentCompany, setCompaniesOptions, startDate, endDate, id]);
    
    // Load comments when company changes
    useEffect(() => {
        if (currentCompany) {
            void sdk.getCompanyComments(currentCompany.id)
                .then(response => {
                    setComments(response.data);
                })
                .catch(error => {
                    console.error('Error fetching comments:', error);
                });
        }
    }, [currentCompany]);

    const handleUpdateCompany = useCallback((newValue: string[]) => {
        setSelectedOption(companiesOptions.find((option) => option.value === newValue[0]));
        setCurrentCompany(companies.find(company => company.id === newValue[0]));
    }, [setSelectedOption, setCurrentCompany, companies, companiesOptions]);

    const handleDateRangeChange = useCallback((newStartDate?: string, newEndDate?: string) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }, [setStartDate, setEndDate]);
    
    // Handle adding a new comment
    const handleAddComment = useCallback((text: string) => {
        if (currentCompany) {
            void sdk.addCompanyComment(currentCompany.id, text)
                .then(response => {
                    setComments(prevComments => [response.data, ...prevComments]);
                })
                .catch(error => {
                    console.error('Error adding comment:', error);
                });
        }
    }, [currentCompany]);
    

    return (
        <DefaultPage title={'Дашборд кампании'}>
            <DashboardControls
                companiesOptions={companiesOptions}
                selectedOption={selectedOption}
                yandexChecked={yandexChecked}
                googleChecked={googleChecked}
                onCompanyChange={handleUpdateCompany}
                onYandexChange={setYandexChecked}
                onGoogleChange={setGoogleChecked}
                onDateRangeChange={handleDateRangeChange}
            />
            
            <Flex style={{marginBottom: 20}}>
                <MetricChart
                    title="Показы"
                    data={currentCompany?.data}
                    dataKeyGoogle="google_impressions"
                    dataKeyYandex="direct_impressions"
                    googleChecked={googleChecked}
                    yandexChecked={yandexChecked}
                    tooltipLabel="Показы"
                />
                
                <MetricChart
                    title="Клики"
                    data={currentCompany?.data}
                    dataKeyGoogle="google_clicks"
                    dataKeyYandex="direct_clicks"
                    googleChecked={googleChecked}
                    yandexChecked={yandexChecked}
                    tooltipLabel="Клики"
                />
                
                <MetricChart
                    title="Бюджет"
                    data={currentCompany?.data}
                    dataKeyGoogle="google_cost"
                    dataKeyYandex="direct_cost"
                    googleChecked={googleChecked}
                    yandexChecked={yandexChecked}
                    formatValue={formatCost}
                    tooltipLabel="Бюджет"
                />
            </Flex>
            
            <Text variant='header-2'>Сравнение с предыдущим днем</Text>
            {googleChecked && (
                <ComparisonSection
                    title="Google"
                    comparison={currentCompany?.comparison?.google}
                    formatCost={formatCost}
                />
            )}
            
            {yandexChecked && (
                <ComparisonSection
                    title="Yandex"
                    comparison={currentCompany?.comparison?.direct}
                    formatCost={formatCost}
                />
            )}
            
            
            <Text variant='header-2'>KPI</Text>
            
            {googleChecked && (
                <KpiSection
                    title="Google"
                    kpiData={currentCompany?.kpiDataGoogle}
                    metrika={currentCompany?.metrika?.google}
                    formatCost={formatCost}
                />
            )}
            
            {yandexChecked && (
                <KpiSection
                    title="Yandex"
                    kpiData={currentCompany?.kpiDataDirect}
                    metrika={currentCompany?.metrika?.direct}
                    formatCost={formatCost}
                />
            )}
            
            {currentCompany && (
                <CompanyComments
                    companyId={currentCompany.id}
                    comments={comments}
                    onAddComment={handleAddComment}
                />
            )}
        </DefaultPage>
    );
};

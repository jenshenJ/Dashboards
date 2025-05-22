import { useCallback, useEffect, useState } from 'react';
import { DefaultPage } from '@/ui/pages/DefaultPage/DefaultPage';
import { Flex, Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import { sdk } from "@/sdk";
import { Company } from '@/sdk/types/company';
import { useSearchParams } from 'react-router-dom';

// Import our new components
import { DashboardControls } from '@/ui/components/DashboardControls/DashboardControls';
import { MetricChart } from '@/ui/components/MetricChart/MetricChart';
import { KpiSection } from '@/ui/components/KpiSection/KpiSection';
import { CompanyComments } from '@/ui/components/CompanyComments/CompanyComments';
import { CompanyComment } from '@/sdk/types/company';
import { KpiMetricsSection } from '@/ui/components/KpiMetricsSection/KpiMetricsSection';

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
    
    // Previous period data for KPI metrics
    const [previousPeriodData, setPreviousPeriodData] = useState<any[]>();
    

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
        
        // If we have a current company and date range, fetch previous period data
        if (currentCompany && startDate && endDate) {
            const currentStartDate = new Date(startDate);
            const currentEndDate = new Date(endDate);
            const daysDiff = Math.round((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
            
            const previousEndDate = new Date(currentStartDate);
            previousEndDate.setDate(previousEndDate.getDate() - 1);
            
            const previousStartDate = new Date(previousEndDate);
            previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
            
            void sdk.getCompanies({
                startDate: previousStartDate.toISOString().split('T')[0],
                endDate: previousEndDate.toISOString().split('T')[0],
                userId: id || undefined
            }).then((response) => {
                const company = response.data.companies.find(c => c.id === currentCompany.id);
                if (company) {
                    setPreviousPeriodData(company.data);
                }
            });
        }
    }, [currentCompany, startDate, endDate, id]);

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
            
            <Flex style={{marginBottom: 20}} className={cn('metrics')}>
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
            
            {currentCompany?.data && (
                <KpiMetricsSection
                    title="Показатели эффективности"
                    googleChecked={googleChecked}
                    yandexChecked={yandexChecked}
                    onGoogleChange={setGoogleChecked}
                    onYandexChange={setYandexChecked}
                    metrics={[
                        {
                            name: "CTR",
                            value: (() => {
                                const clicks = currentCompany.data.reduce((sum, day) => {
                                    let dayClicks = 0;
                                    if (googleChecked) dayClicks += day.google_clicks;
                                    if (yandexChecked) dayClicks += day.direct_clicks;
                                    return sum + dayClicks;
                                }, 0);
                                
                                const impressions = currentCompany.data.reduce((sum, day) => {
                                    let dayImpressions = 0;
                                    if (googleChecked) dayImpressions += day.google_impressions;
                                    if (yandexChecked) dayImpressions += day.direct_impressions;
                                    return sum + dayImpressions;
                                }, 0);
                                
                                return impressions > 0 ? (clicks / impressions) * 100 : 0;
                            })(),
                            previousValue: (() => {
                                if (!previousPeriodData) return 0;
                                
                                const clicks = previousPeriodData.reduce((sum, day) => {
                                    let dayClicks = 0;
                                    if (googleChecked) dayClicks += day.google_clicks;
                                    if (yandexChecked) dayClicks += day.direct_clicks;
                                    return sum + dayClicks;
                                }, 0);
                                
                                const impressions = previousPeriodData.reduce((sum, day) => {
                                    let dayImpressions = 0;
                                    if (googleChecked) dayImpressions += day.google_impressions;
                                    if (yandexChecked) dayImpressions += day.direct_impressions;
                                    return sum + dayImpressions;
                                }, 0);
                                
                                return impressions > 0 ? (clicks / impressions) * 100 : 0;
                            })()
                        },
                        {
                            name: "CPC",
                            value: (() => {
                                const cost = currentCompany.data.reduce((sum, day) => {
                                    let dayCost = 0;
                                    if (googleChecked) dayCost += day.google_cost;
                                    if (yandexChecked) dayCost += day.direct_cost;
                                    return sum + dayCost;
                                }, 0);
                                
                                const clicks = currentCompany.data.reduce((sum, day) => {
                                    let dayClicks = 0;
                                    if (googleChecked) dayClicks += day.google_clicks;
                                    if (yandexChecked) dayClicks += day.direct_clicks;
                                    return sum + dayClicks;
                                }, 0);
                                
                                return clicks > 0 ? cost / clicks : 0;
                            })(),
                            previousValue: (() => {
                                if (!previousPeriodData) return 0;
                                
                                const cost = previousPeriodData.reduce((sum, day) => {
                                    let dayCost = 0;
                                    if (googleChecked) dayCost += day.google_cost;
                                    if (yandexChecked) dayCost += day.direct_cost;
                                    return sum + dayCost;
                                }, 0);
                                
                                const clicks = previousPeriodData.reduce((sum, day) => {
                                    let dayClicks = 0;
                                    if (googleChecked) dayClicks += day.google_clicks;
                                    if (yandexChecked) dayClicks += day.direct_clicks;
                                    return sum + dayClicks;
                                }, 0);
                                
                                return clicks > 0 ? cost / clicks : 0;
                            })()
                        },
                        {
                            name: "CPM",
                            value: (() => {
                                const cost = currentCompany.data.reduce((sum, day) => {
                                    let dayCost = 0;
                                    if (googleChecked) dayCost += day.google_cost;
                                    if (yandexChecked) dayCost += day.direct_cost;
                                    return sum + dayCost;
                                }, 0);
                                
                                const impressions = currentCompany.data.reduce((sum, day) => {
                                    let dayImpressions = 0;
                                    if (googleChecked) dayImpressions += day.google_impressions;
                                    if (yandexChecked) dayImpressions += day.direct_impressions;
                                    return sum + dayImpressions;
                                }, 0);
                                
                                return impressions > 0 ? (cost / impressions) * 1000 : 0;
                            })(),
                            previousValue: (() => {
                                if (!previousPeriodData) return 0;
                                
                                const cost = previousPeriodData.reduce((sum, day) => {
                                    let dayCost = 0;
                                    if (googleChecked) dayCost += day.google_cost;
                                    if (yandexChecked) dayCost += day.direct_cost;
                                    return sum + dayCost;
                                }, 0);
                                
                                const impressions = previousPeriodData.reduce((sum, day) => {
                                    let dayImpressions = 0;
                                    if (googleChecked) dayImpressions += day.google_impressions;
                                    if (yandexChecked) dayImpressions += day.direct_impressions;
                                    return sum + dayImpressions;
                                }, 0);
                                
                                return impressions > 0 ? (cost / impressions) * 1000 : 0;
                            })()
                        },
                        {
                            name: "Конверсии",
                            value: (() => {
                                let conversions = 0;
                                if (googleChecked && currentCompany?.metrika?.google?.Conversions) {
                                    conversions += Number(currentCompany.metrika.google.Conversions.value || 0);
                                }
                                if (yandexChecked && currentCompany?.metrika?.direct?.Conversions) {
                                    conversions += Number(currentCompany.metrika.direct.Conversions.value || 0);
                                }
                                return conversions;
                            })(),
                            previousValue: 0 // We don't have previous period data for conversions
                        }
                    ]}
                    dailyData={currentCompany.data.map(day => {
                        // Calculate metrics for each day based on selected platforms
                        const googleClicks = googleChecked ? day.google_clicks : 0;
                        const yandexClicks = yandexChecked ? day.direct_clicks : 0;
                        const totalClicks = googleClicks + yandexClicks;
                        
                        const googleImpressions = googleChecked ? day.google_impressions : 0;
                        const yandexImpressions = yandexChecked ? day.direct_impressions : 0;
                        const totalImpressions = googleImpressions + yandexImpressions;
                        
                        const googleCost = googleChecked ? day.google_cost : 0;
                        const yandexCost = yandexChecked ? day.direct_cost : 0;
                        const totalCost = googleCost + yandexCost;
                        
                        // Calculate daily conversions
                        let conversions = 0;
                        if (googleChecked && currentCompany?.metrika?.google?.Conversions) {
                            conversions += Number(currentCompany.metrika.google.Conversions.value || 0) / currentCompany.data.length;
                        }
                        if (yandexChecked && currentCompany?.metrika?.direct?.Conversions) {
                            conversions += Number(currentCompany.metrika.direct.Conversions.value || 0) / currentCompany.data.length;
                        }
                        
                        return {
                            date: day.date,
                            "CTR": totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
                            "CPC": totalClicks > 0 ? totalCost / totalClicks : 0,
                            "CPM": totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0,
                            "Конверсии": conversions
                        };
                    })}
                    formatValue={(value) => {
                        if (value >= 1000) {
                            return `${(value / 1000).toFixed(2)}k`;
                        }
                        return value.toFixed(2);
                    }}
                />
            )}
            
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

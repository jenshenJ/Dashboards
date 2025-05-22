import { Checkbox, Flex, Select, Text } from '@gravity-ui/uikit';
import { RangeDatePicker } from '@gravity-ui/date-components';
import { FC } from 'react';
import './DashboardControls.scss';
import { Company } from '@/sdk/types/company';

export type DashboardControlsProps = {
    companiesOptions: {content: string, value: string}[];
    selectedOption?: {content: string, value: string};
    yandexChecked: boolean;
    googleChecked: boolean;
    onCompanyChange: (newValue: string[]) => void;
    onYandexChange: (checked: boolean) => void;
    onGoogleChange: (checked: boolean) => void;
    onDateRangeChange: (startDate?: string, endDate?: string) => void;
};

export const DashboardControls: FC<DashboardControlsProps> = ({
    companiesOptions,
    selectedOption,
    yandexChecked,
    googleChecked,
    onCompanyChange,
    onYandexChange,
    onGoogleChange,
    onDateRangeChange,
}) => {
    return (
        <Flex className="dashboard__controls">
            <Flex direction={'column'}>
                <Text variant='subheader-1'>{'Выберите промежуток'}</Text>
                <RangeDatePicker
                    hasClear
                    size='l'
                    style={{width: 240}}
                    format='DD/MM/YYYY'
                    onUpdate={
                        (value) => {
                            const startDate = value?.start.add(1, 'day').toISOString().split('T')[0];
                            const endDate = value?.end.toISOString().split('T')[0];
                            onDateRangeChange(startDate, endDate);
                        }       
                    }
                />
            </Flex>
            <Flex alignItems={'end'}>
                <Select 
                    onUpdate={onCompanyChange} 
                    placeholder={"Выберите компанию"} 
                    size="l" 
                    value={[selectedOption?.content || '']} 
                    options={companiesOptions}
                />
            </Flex>
            <Flex alignItems={'end'} gap={4}>
                <Checkbox checked={yandexChecked} onUpdate={onYandexChange} size={'l'} content={'Яндекс.Директ'}/>
                <Checkbox checked={googleChecked} onUpdate={onGoogleChange} size={'l'} content={'Google Ads'}/>
            </Flex>
        </Flex>
    );
};
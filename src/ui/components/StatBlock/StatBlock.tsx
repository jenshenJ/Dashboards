import { Card, Text } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import './StatBlock.scss';

export type StatBlockProps = {
    value?: string | number;
    title?: string;
};

const cn = block('stat-block');

export const StatBlock = ({value, title}: StatBlockProps) => {

    return (
        <Card view={'filled'} theme={'utility'} className={cn()}>
            <Text variant={'header-1'}>{title}</Text>
            <Text variant={'subheader-3'}>{value}</Text>
        </Card>
    )
};
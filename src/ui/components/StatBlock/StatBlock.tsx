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
            <div className={cn('title')}>{title}</div>
            <div className={cn('value')}>{value}</div>
        </Card>
    )
};
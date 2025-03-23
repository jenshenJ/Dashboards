import { Text } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import './InfoRow.scss';

const cn = block('info-row');

export const InfoRow = ({title, value}: {title: string, value: string | number}) => {
    return (
        <div className={cn()} key={title}>
            <Text color='brand' variant='subheader-1'>{title}</Text>
            <Text variant='subheader-2'>{value}</Text>
        </div>
    )
}
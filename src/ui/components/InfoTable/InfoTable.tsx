import { FC } from 'react';
import block from 'bem-cn-lite';
import { InfoRow } from '../InfoRow/InfoRow';

import './InfoTable.scss';

const cn = block('info-table');

export const InfoTable = ({items}: {items: {title: string, value: string | number}[]}) => {
    return(
        <div className={cn()}>
            {
                items.map(item => (<InfoRow title={item.title} value={item.value}/>))
            }
        </div>
    )
}
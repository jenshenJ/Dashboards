import { Text } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './PageHeader.scss';

const cn = block('page-header');

export const PageHeader = ({title}: {title: string}) => {
    return (
        <Text className={cn()} variant={'display-2'}>{title}</Text>
    );
}

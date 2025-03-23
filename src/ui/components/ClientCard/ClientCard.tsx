

import { FC } from 'react';
import { Card, Flex, Link, Text } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import './ClientCard.scss';


export type FilmCardProps = {
    id: string,
    username: string,
    companiesCount: string,
};

const cn = block('client-card');

export const ClientCard: FC<FilmCardProps> = ({
    id,
    username,
    companiesCount,
}) => {
    return (
        <Card view={'filled'} theme={'normal'} className={cn()} key={id}>
            <Link href={`/dashboard?id=${id}`}>
                <Flex direction={'column'}>
                    <Text color={'primary'} variant="subheader-3">{username}</Text>
                    <Text color={'secondary'} variant={"subheader-1"}>{`Количество кампаний: ${companiesCount}`}</Text>
                </Flex>
            </Link>
        </Card>
    );
}

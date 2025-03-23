import { FC, useEffect, useMemo, useState } from 'react';
import { Card, DropdownMenu, Link, Modal, Text } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import { sdk } from '@/sdk';
import useAuth from '@/ui/auth/useAuth';

import './FilmCard.scss';
import { Estimate } from '../Estimate/Estimate';
import { getEstimationColor } from '@/ui/utils/getEstimationColor';


export type FilmCardProps = {
    id: number,
    ruTitle: string,
    enTitle: string,
    releaseYear: number,
    imdbRating: number,
    kpRating: number,
    imageURL: string,
    countries: string[],
    genres: string[],
    rang?: number,
};

const cn = block('film-card');

export const FilmCard: FC<FilmCardProps> = ({
    id,
    ruTitle,
    enTitle,
    imdbRating,
    kpRating,
    imageURL,
    countries,
    genres,
    rang,
}) => {
    const countriesString = countries.join(', ');
    const genresString = genres.join(', ');
    const [open, setOpen] = useState(false);
    const [estimated, setEstimated] = useState(false);
    const [estimation, setEstimation] = useState('');
    const { user } = useAuth();


    console.log(estimated);

    useEffect(() => {
        setEstimated(user?.estimations?.find((item) => item.movieId === String(id)) ? true : false);
        setEstimation(user?.estimations?.find((item) => item.movieId === String(id))?.estimate ?? '');
    }, [user, estimated]);


    const filmActions = useMemo(() => ([
        [
            {
                text: user?.watched?.includes(String(id)) ? 'Не просмотрен' : 'Просмотрен',
                action: () => sdk.watched(String(id)),
                theme: user?.watched?.includes(String(id)) ? 'danger' : 'normal',
            },
            {
                text:  estimated ? 'Удалить оценку' : 'Оценить',
                theme:  estimated ? 'danger' : 'normal',
                action: () => {
                    if (estimated) {
                        sdk.estimate(String(id))
                        setEstimated(false);
                        window.location.reload();
                        return
                    }

                    setOpen(true);
                },
            },
        ],
        [
            {
                text:  user?.willWatch?.includes(String(id)) ? 'Не буду смотреть' : 'Буду смотреть',
                action: () => sdk.willWatch(String(id)),
                theme: user?.willWatch?.includes(String(id)) ? 'danger' : 'normal',
            }
        ],
    ]), [id, estimated]);

    return (
        <Card view={'filled'} theme={'normal'} className={cn()} key={id}>
            <div className={cn('left-content')}>
                <Text variant={'header-1'}>{rang}</Text>
                <img className={cn('image')} src={imageURL}/>
                <div className={cn('info')}>
                    <Link className={cn('title')} href={`/films/${id}#anchor`}>{ruTitle}</Link>
                    <Text>{enTitle}</Text>
                    <Text color={'secondary'}>{`${countriesString}`}</Text>
                    <Text>{`${genresString}`}</Text>
                    {estimated && <Text variant='subheader-2'>{'Ваша оценка: '}<Text variant={'subheader-3'} color={getEstimationColor(estimation)}>{estimation}</Text></Text>}
                </div>
            </div>
            <div className={cn('ratings')}>
                <Text variant='subheader-3' color={getEstimationColor(String(kpRating))}>{kpRating}</Text>
                <Text variant='subheader-1' color={'secondary'}>{imdbRating}</Text>
            </div>
            <div>
                { /* @ts-ignore */ }
                <DropdownMenu items={filmActions}/>
            </div>

            <Modal onClose={() => {setOpen(false)}} open={open}>
                <Estimate onSubmit={(estimation) => {setEstimation(estimation); window.location.reload()}} movieId={String(id)}/>
            </Modal>
        </Card>
    );
}

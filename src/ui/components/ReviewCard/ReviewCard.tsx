import { Card, UserLabel, Text } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import { Review } from '@/sdk/types/review';

import './ReviewCard.scss';

export type ReviewCardProps = {
    item: Review;
}

const cn = block('review-card');

const reviewTypesMap = {
    'Позитивный': 'positive',
    'Нейтральный': 'neutral',
    'Негативный': 'negative',
}

const cardTypesMap = {
    'positive': 'success',
    'neutral': 'info',
    'negative': 'danger',
}

export const ReviewCard = ({item}: ReviewCardProps) => {
    const reviewType = reviewTypesMap[item.type] as 'positive' | 'neutral' | 'negative';
    const theme = cardTypesMap[reviewType] as 'success' | 'info' | 'danger';

    return (
        <Card theme={theme ?? 'info'} className={cn()}>
            <UserLabel size='m'>{item.author}</UserLabel>

            <div className={cn('content')}>
                <Text variant='subheader-2' color='brand'>{item.title}</Text>
                <Text className={cn('g')} dangerouslySetInnerHTML={{__html: item.review}}></Text>
            </div>
        </Card>
    )
}
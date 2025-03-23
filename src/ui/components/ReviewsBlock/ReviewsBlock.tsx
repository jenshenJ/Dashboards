import { Text } from "@gravity-ui/uikit";

import block from 'bem-cn-lite';

import { Review } from "@/sdk/types/review";

import './ReviewsBlock.scss';
import { ReviewCard } from "../ReviewCard/ReviewCard";

const cn = block('reviews-block');

export type ReviewsBlockProps = {
    items: Review[],
}

export const ReviewsBlock = ({items}: ReviewsBlockProps) => {
    return (
        <div className={cn()}>
            <Text className={cn('title')} variant="header-1">{'Рецензии'}</Text>

            <div className={cn('content')}>
                {
                    items.map((item) => (
                        <ReviewCard key={item.id} item={item}/>
                    ))
                }
            </div>
            
        </div>
    );
};

import { useCallback, useState } from "react";
import { Button, Select, Text, TextArea, TextInput } from '@gravity-ui/uikit';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import block from 'bem-cn-lite';

import { sdk } from "@/sdk";
import useAuth from "@/ui/auth/useAuth";

import './CreateReview.scss';

export type CreateReviewProps = {
    movieId: string,
};

const cn = block('create-review');

export const CreateReview = ({movieId}: CreateReviewProps) => {
    const { register, handleSubmit } = useForm(); 

    const [reviewType, setReviewType] =  useState<string[]>([]);

    const onSubmit = useCallback(async (d: {title: string, review: string}) => {
        await sdk.postReview(d.title, d.review, movieId, reviewType.length ? reviewType[0] : undefined);
        window.location.reload();
    }, [reviewType]);

    return (
        <div className={cn()}>
            <Text variant='subheader-3'>{'Написать рецензию'}</Text>

            <form className={cn('form')} onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
                <label>
                    <Select onUpdate={(value) => setReviewType(value)} options={[
                        {content: 'Позитивный', value: 'Позитивны'},
                        {content: 'Нейтральный', value: 'Нейтральный'},
                        {content: 'Негативный', value: 'Негативный'},
                    ]} className={cn('select')} label='Тип рецензии' {...register('type')} />
                </label>
                <label>
                    <Text>{'Заголовок рецензии'}</Text>
                    <TextInput {...register('title', {required: true})} />
                </label>
                <label>
                    <Text>{'Текст рецензии'}</Text>
                    <TextArea rows={4} {...register('review', {required: true})} />
                </label>
                <Button type='submit' view='action'>{'Отправить'}</Button>
            </form>
        </div>
    )
}
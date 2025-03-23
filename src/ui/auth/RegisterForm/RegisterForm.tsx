import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { TextInput, Text, Modal, Button } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import useAuth from '../useAuth';

import './RegisterForm.scss';
import { useCallback, useState } from 'react';

const cn = block('register-form');

export type RegisterFormProps = {
    onGoToLoginClick: () => void;
}
export const RegisterForm = ({onGoToLoginClick}: RegisterFormProps) => {
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();
    const { register: signUp } = useAuth();



    const onSubmit = useCallback(async (d: { username: string, password: string, confirmPassword: string}) => {
        if (d.password !== d.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const signUpError = await signUp(d.username, d.password);

        if (signUpError) {
            setError(signUpError);
        }
    }, [signUp, setError]);

    return (
        <div className={cn()}>
            <Text variant='header-2'>{'Вход'}</Text>
            <form className={cn('form')} onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
                <label>
                    <Text>{'Имя пользователя'}</Text>
                    <TextInput {...register('username', {required: true})} />
                </label>
                <label>
                    <Text>{'Пароль'}</Text>
                    <TextInput type={'password'} {...register('password', {required: true})} />
                </label>
                <label>
                    <Text>{'Пароль'}</Text>
                    <TextInput type={'password'} {...register('confirmPassword', {required: true})} />
                </label>
                {error && <Text color='danger'>{error}</Text>}
                <Button type='submit' view='action'>{'Зарегестрироваться'}</Button>
                <Button onClick={onGoToLoginClick} view='flat-secondary'>{'Логин'}</Button>
            </form>
        </div>
    );
}

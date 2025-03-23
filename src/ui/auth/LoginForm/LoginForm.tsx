import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { TextInput, Text, Button } from '@gravity-ui/uikit';

import block from 'bem-cn-lite';

import useAuth from '../useAuth';

import './LoginForm.scss';
import { useCallback, useState } from 'react';

const cn = block('login-form');

export type LoginFormProps = {
    onGoToSignUpClick: () => void;
}
export const LoginForm = ({onGoToSignUpClick}: LoginFormProps) => {
    const [error, setError] = useState('');
    const { register, handleSubmit } = useForm();
    const { logIn } = useAuth();


    const onSubmit = useCallback(async (d: {username: string, password: string}) => {
        const loginError = await logIn(d.username, d.password);

        if (loginError) {
            setError(loginError);
        }
    }, [logIn, setError]);

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
                {error && <Text color='danger'>{error}</Text>}
                <Button type='submit' view='action'>{'Войти'}</Button>
                <Button onClick={onGoToSignUpClick} view='flat-secondary'>{'Регистрация'}</Button>
            </form>
        </div>
    );
}

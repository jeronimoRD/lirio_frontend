import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from '../../session/context';

export type LoginForm = { email: string; password: string };

export function useLogin() {
    const { signIn } = useSession();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, setError, clearErrors, formState } = useForm<LoginForm>({
        defaultValues: { email: '', password: '' },
    });

    const togglePassword = () => setShowPassword((v) => !v);

    const onSubmit = async ({ email, password }: LoginForm) => {
        clearErrors('root');

        try {
        const user = await signIn(email, password);
        router.replace(user.role === 'ADMIN' ? '/(admin)' : '/home');
        } catch (error) {

        setError('root', { message: (error as Error).message });
        }
    };

    return {
        control,
        showPassword,
        togglePassword,
        isSubmitting: formState.isSubmitting,
        rootError: formState.errors.root?.message,
        submit: handleSubmit(onSubmit),
    };
}
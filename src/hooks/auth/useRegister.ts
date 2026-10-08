import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from '../session/context';
import { getCategories } from '../api/categories';
import type { Category } from '../types';

export type RegisterForm = { name: string; email: string; password: string };

export function useRegister() {
    const router = useRouter();
    const { signUp } = useSession();

    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [styleOptions, setStyleOptions] = useState<Category[]>([]);

    const { control, handleSubmit, setError, clearErrors, formState } = useForm<RegisterForm>({
        defaultValues: { name: '', email: '', password: '' },
    });

    useEffect(() => {
        let active = true;

        getCategories()
        .then((categories) => {
            if (active) setStyleOptions(categories);
        })
        .catch(() => {
            if (active) setStyleOptions([]);
        });

        return () => {
        active = false;
        };
    }, []);

    const togglePassword = () => setShowPassword((v) => !v);

    const toggleStyle = (categoryId: string) => {
        setSelectedStyles((prev) =>
        prev.includes(categoryId) ? prev.filter((s) => s !== categoryId) : [...prev, categoryId]
        );
    };

    const onSubmit = async (data: RegisterForm) => {
        clearErrors('root');
        setSuccess(false);

    try {
        await signUp(data.name, data.email, data.password, selectedStyles);
        setSuccess(true);
        } catch (error) {
        setError('root', { message: (error as Error).message });
        }
    };

    const goBack = () => {
        if (router.canGoBack()) {
        router.back();
        } else {
        router.replace('/(login)/login');
        }
    };

    return {
        control,
        success,
        showPassword,
        togglePassword,
        selectedStyles,
        styleOptions,
        toggleStyle,
        goBack,
        isSubmitting: formState.isSubmitting,
        rootError: formState.errors.root?.message,
        submit: handleSubmit(onSubmit),
    };
}
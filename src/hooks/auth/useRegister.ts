
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';

import { useSession } from '../../session/context';
import { getCategories } from '../../api/categories';
import type { Category } from '../../types';

export type RegisterForm = {
    user_name: string;
    email: string;
    password: string;
};

export function useRegister() {
    const router = useRouter();
    const { signUp } = useSession();

    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [styleOptions, setStyleOptions] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
                
    const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState,
    } = useForm<RegisterForm>({
    defaultValues: {
        user_name: '',
        email: '',
        password: '',
    },
    });

    useEffect(() => {
    let active = true;

    const loadCategories = async () => {
        try {
        const categories = await getCategories();

        if (active) {
            setStyleOptions(categories);
        }
        } catch {
        if (active) {
            setStyleOptions([]);
        }
        } finally {
        if (active) {
            setLoadingCategories(false);
        }
        }
    };

    loadCategories();

    return () => {
        active = false;
    };
    }, []);

    const toggleShowPassword = () => {
    setShowPassword((previous) => !previous);
    };

    const toggleStyle = (categoryId: string) => {
    setSelectedStyles((previous) =>
        previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId],
    );
    };

    const onSubmit = async (data: RegisterForm) => {
    clearErrors('root');
    setSuccess(false);

    try {
        await signUp(
        data.user_name,
        data.email,
        data.password,
        selectedStyles,
        );

        setSuccess(true);
    } catch (err: unknown) {
        const message =
        err instanceof Error
            ? err.message
            : 'No fue posible crear la cuenta. Inténtalo nuevamente.';

        setError('root', { message });
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
    toggleShowPassword,
    selectedStyles,
    styleOptions,
    toggleStyle,
    loadingCategories,
    loading: formState.isSubmitting,
    isSubmitting: formState.isSubmitting,
    error: formState.errors.root?.message,
    rootError: formState.errors.root?.message,
    goBack,
    submit: handleSubmit(onSubmit),
    };
}

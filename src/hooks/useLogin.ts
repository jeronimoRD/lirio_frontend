import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from '../session/context';

/** Los datos que captura este formulario. */
export type LoginForm = { email: string; password: string };

export function useLogin() {
    const { signIn } = useSession();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    // `control` conecta los campos, `handleSubmit` valida antes de enviar y
    // `formState` trae los errores y si se está enviando en este momento.
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
        // `root` es el error del formulario completo (credenciales malas, servidor
        // caído...). El mensaje es el que devolvió el servidor.
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
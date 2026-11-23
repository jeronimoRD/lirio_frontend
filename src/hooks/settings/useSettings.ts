import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { deleteAccount, updatePassword, updateProfile } from '../../api/users';
import { registerThisDevice, unregisterThisDevice } from '../general/usePushNotifications';
import { useSession } from '../../session/context';
import { messageOf, type ResultMessage } from '../../utils/resultMessage';

export type ProfileForm = {
    email: string;
};

export type PasswordForm = {
    password: string;
    confirm: string;
};

export function useSettings() {
    const { user, signOut, refreshUser } = useSession();
    const router = useRouter();

    const profileForm = useForm<ProfileForm>({
        defaultValues: { email: user?.email ?? '' },
    });

    const passwordForm = useForm<PasswordForm>({
        defaultValues: { password: '', confirm: '' },
    });

    const newPassword = useWatch({
        control: passwordForm.control,
        name: 'password',
    });

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [profileMessage, setProfileMessage] = useState<ResultMessage | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<ResultMessage | null>(null);
    const [deleteMessage, setDeleteMessage] = useState<ResultMessage | null>(null);

    const [pushEnabled, setPushEnabled] = useState(true);
    const [savingPush, setSavingPush] = useState(false);
    const [pushMessage, setPushMessage] = useState<ResultMessage | null>(null);
    const [emailEnabled, setEmailEnabled] = useState(false);

    const saveProfile = async (data: ProfileForm) => {
    if (!user) return;

    setProfileMessage(null);
    setSavingProfile(true);

    try {
        await updateProfile(user.name, data.email.trim().toLowerCase(), user.bio);
        await refreshUser();
        setProfileMessage({ kind: 'ok', text: 'Datos actualizados correctamente' });
        } catch (err) {
        setProfileMessage({ kind: 'error', text: messageOf(err) });
        } finally {
        setSavingProfile(false);
        }
    };

    const savePassword = async (data: PasswordForm) => {
    setPasswordMessage(null);
    setSavingPassword(true);

    try {
        await updatePassword(data.password);
        passwordForm.reset();
        setPasswordMessage({ kind: 'ok', text: 'Contraseña actualizada correctamente' });
        } catch (err) {
        setPasswordMessage({ kind: 'error', text: messageOf(err) });
        } finally {
        setSavingPassword(false);
        }
    };

    const removeAccount = async () => {
    setConfirmingDelete(false);
    setDeleteMessage(null);
    setDeleting(true);

    try {
        await deleteAccount();
        signOut();
        } catch (err) {
        setDeleteMessage({ kind: 'error', text: messageOf(err) });
        } finally {
        setDeleting(false);
        }
    };

    /**
     * Activar pide permiso y registra el teléfono; desactivar lo da de baja en
     * el servidor. Si algo falla, el interruptor vuelve a su estado anterior.
     */
    const togglePush = async (enabled: boolean) => {
        setPushMessage(null);
        setPushEnabled(enabled);
        setSavingPush(true);

        try {
            if (enabled) {
                const registered = await registerThisDevice();

                if (!registered) {
                    setPushEnabled(false);
                    setPushMessage({
                        kind: 'error',
                        text: 'No se pudo activar el push en este dispositivo. Revisa el permiso de notificaciones.',
                    });
                }
            } else {
                await unregisterThisDevice();
            }
        } catch (err) {
            setPushEnabled(!enabled);
            setPushMessage({ kind: 'error', text: messageOf(err) });
        } finally {
            setSavingPush(false);
        }
    };

    /**
     * Vuelve siempre a la pestaña de perfil. El back normal no sirve: la barra
     * de tabs no navega, así que la ruta previa sigue siendo la de origen
     * (casi siempre /home) y aterrizaría en el Home.
     */
    const goBack = () => {
        router.replace('/profile');
    };

    const validateConfirm = (value: string) => value === newPassword || 'Las contraseñas no coinciden';

    return {
    user,
    goBack,


    profileControl: profileForm.control,
    submitProfile: profileForm.handleSubmit(saveProfile),
    savingProfile,
    profileMessage,

    passwordControl: passwordForm.control,
    submitPassword: passwordForm.handleSubmit(savePassword),
    validateConfirm,
    savingPassword,
    passwordMessage,

    pushEnabled,
    togglePush,
    savingPush,
    pushMessage,
    emailEnabled,
    setEmailEnabled,

    deleting,
    deleteMessage,
    confirmingDelete,
    askDeleteConfirmation: () => setConfirmingDelete(true),
    cancelDeleteConfirmation: () => setConfirmingDelete(false),
    removeAccount,
    };
}
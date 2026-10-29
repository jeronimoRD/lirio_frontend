import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { updateProfile } from '../../api/users';
import { useSession } from '../../session/context';
import { messageOf, type ResultMessage } from '../../utils/resultMessage';

export type ProfileForm = {
    name: string;
};

export function useEditProfile() {
    const { user, refreshUser } = useSession();
    const router = useRouter();

    const profileForm = useForm<ProfileForm>({
        defaultValues: { name: user?.name ?? '' },
    });

    const [bio, setBio] = useState(user?.bio ?? '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<ResultMessage | null>(null);

    const saveProfile = async (data: ProfileForm) => {
    if (!user) return;

    setMessage(null);
    setSaving(true);

    try {
        await updateProfile(data.name.trim(), user.email.trim().toLowerCase(), bio.trim());
        await refreshUser();
        setMessage({ kind: 'ok', text: 'Datos actualizados correctamente' });
        } catch (err) {
        setMessage({ kind: 'error', text: messageOf(err) });
        } finally {
        setSaving(false);
        }
    };

    const goBack = () => {
        if (router.canGoBack()) {
        router.back();
        } else {
        router.replace('/home');
        }
    };

    return {
        user,
        control: profileForm.control,
        bio,
        setBio,
        saving,
        message,
        submit: profileForm.handleSubmit(saveProfile),
        goBack,
    };
}
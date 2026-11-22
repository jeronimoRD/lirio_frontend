import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import {
    setBannerColor,
    updateProfile,
    uploadAvatar,
    uploadBanner,
} from '../../api/users';
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
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
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

    /** Abre la galería recortada al formato pedido. Devuelve null si se cancela. */
    const pickImage = async (
        aspect: [number, number],
    ): Promise<string | null> => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permiso necesario',
                'Necesitas permitir el acceso a tus imágenes.',
            );
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect,
            quality: 0.8,
        });

        if (result.canceled || result.assets.length === 0) {
            return null;
        }

        return result.assets[0].uri;
    };

    const changeAvatar = async () => {
        setMessage(null);

        try {
            const uri = await pickImage([1, 1]);

            if (!uri) return;

            setUploadingAvatar(true);
            await uploadAvatar(uri);
            await refreshUser();
            setMessage({ kind: 'ok', text: 'Foto de perfil actualizada' });
        } catch (err) {
            setMessage({ kind: 'error', text: messageOf(err) });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const changeBanner = async () => {
        setMessage(null);

        try {
            const uri = await pickImage([2, 1]);

            if (!uri) return;

            setUploadingBanner(true);
            await uploadBanner(uri);
            await refreshUser();
            setMessage({ kind: 'ok', text: 'Foto de portada actualizada' });
        } catch (err) {
            setMessage({ kind: 'error', text: messageOf(err) });
        } finally {
            setUploadingBanner(false);
        }
    };

    /**
     * Fija un color de portada. El servidor borra la foto que tuviera:
     * elegir un color la sustituye.
     */
    const chooseBannerColor = async (color: string) => {
        setMessage(null);
        setUploadingBanner(true);

        try {
            await setBannerColor(color);
            await refreshUser();
            setMessage({ kind: 'ok', text: 'Color de portada aplicado' });
        } catch (err) {
            setMessage({ kind: 'error', text: messageOf(err) });
        } finally {
            setUploadingBanner(false);
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

    return {
        user,
        control: profileForm.control,
        bio,
        setBio,
        saving,
        uploadingAvatar,
        uploadingBanner,
        message,
        submit: profileForm.handleSubmit(saveProfile),
        changeAvatar,
        changeBanner,
        chooseBannerColor,
        goBack,
    };
}

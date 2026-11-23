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
    const [message, setMessage] = useState<ResultMessage | null>(null);

    // Nada se envía al servidor hasta pulsar "Guardar cambios".
    const [pendingAvatarUri, setPendingAvatarUri] = useState<string | null>(null);
    const [pendingBannerUri, setPendingBannerUri] = useState<string | null>(null);
    const [pendingBannerColor, setPendingBannerColor] = useState<string | null>(null);
    const [discardOpen, setDiscardOpen] = useState(false);

    const hasPendingChanges =
        pendingAvatarUri !== null ||
        pendingBannerUri !== null ||
        pendingBannerColor !== null ||
        bio !== (user?.bio ?? '') ||
        profileForm.formState.isDirty;

    /**
     * Aplica todo lo pendiente y lleva al perfil. Va en orden y se detiene en
     * el primer error: lo ya subido queda aplicado y el aviso es el del
     * servidor. La validación del nombre corre antes de subir nada, porque
     * pasa por handleSubmit.
     */
    const saveProfile = async (data: ProfileForm) => {
    if (!user) return;

    setMessage(null);
    setSaving(true);

    try {
        if (pendingAvatarUri) {
            await uploadAvatar(pendingAvatarUri);
        }

        if (pendingBannerUri) {
            await uploadBanner(pendingBannerUri);
        } else if (pendingBannerColor) {
            await setBannerColor(pendingBannerColor);
        }

        await updateProfile(data.name.trim(), user.email.trim().toLowerCase(), bio.trim());
        await refreshUser();
        router.replace('/profile');
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

    /** Elige la foto de perfil. Aún no se sube: solo queda pendiente. */
    const changeAvatar = async () => {
        setMessage(null);

        const uri = await pickImage([1, 1]);

        if (!uri) return;

        setPendingAvatarUri(uri);
    };

    /** Elige la foto de portada. Aún no se sube: solo queda pendiente. */
    const changeBanner = async () => {
        setMessage(null);

        const uri = await pickImage([2, 1]);

        if (!uri) return;

        setPendingBannerUri(uri);
        setPendingBannerColor(null);
    };

    /**
     * Marca un color de portada pendiente. Foto y color se excluyen, aquí y en
     * el servidor: gana el último que se elija.
     */
    const chooseBannerColor = (color: string) => {
        setMessage(null);
        setPendingBannerColor(color);
        setPendingBannerUri(null);
    };

    /**
     * Vuelve siempre a la pestaña de perfil. El back normal no sirve: la barra
     * de tabs no navega, así que la ruta previa sigue siendo la de origen
     * (casi siempre /home) y aterrizaría en el Home. Si hay cambios sin
     * guardar, pregunta antes de descartarlos.
     */
    const goBack = () => {
        if (hasPendingChanges) {
            setDiscardOpen(true);
            return;
        }

        router.replace('/profile');
    };

    const confirmDiscard = () => {
        setDiscardOpen(false);
        router.replace('/profile');
    };

    const cancelDiscard = () => setDiscardOpen(false);

    return {
        user,
        control: profileForm.control,
        bio,
        setBio,
        saving,
        message,
        hasPendingChanges,
        discardOpen,
        pendingAvatarUri,
        pendingBannerUri,
        pendingBannerColor,
        submit: profileForm.handleSubmit(saveProfile),
        changeAvatar,
        changeBanner,
        chooseBannerColor,
        confirmDiscard,
        cancelDiscard,
        goBack,
    };
}

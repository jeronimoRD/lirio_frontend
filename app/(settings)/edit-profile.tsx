import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { updateProfile } from '../../src/api/users';
import Field from '../../src/components/Field';
import { useSession } from '../../src/session/context';

import {
  IconWell,
  SectionCard,
  SectionHeaderRow,
  SectionLabel,
} from '../../src/components/SettingsSections';
import ScreenHeader from '../../src/components/ScreenHeader';

type ProfileForm = {
  name: string;
};

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}

export default function EditProfile() {
  const { user, refreshUser } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
    },
  });

  const [bio, setBio] = useState(user?.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  const saveProfile = async (data: ProfileForm) => {
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="items-center px-5"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }}>
      <View className="w-full max-w-[390px] gap-6">
        {/* Edit-profile header */}
        <ScreenHeader title="Editar perfil" onBack={handleBack} />

        {/* Perfil */}
        <View className="gap-2.5">
          <SectionLabel text="PERFIL" />
          <SectionCard>
            <SectionHeaderRow
              icon={<UserRound size={18} color="#A81245" />}
              label="Nombre y bibliografía"
            />

            <View className="gap-4">
              <Field
                control={profileForm.control}
                name="name"
                label="Nombre"
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={50}
                rules={{
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                }}
              />

              <View className="gap-1">
                <Text className="text-xs font-semibold uppercase text-[#6E6B68]">Bibliografía</Text>
                <TextInput
                  className="min-h-24 rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] p-3 text-sm text-[#292724]"
                  placeholder="Cuéntanos algo sobre ti..."
                  placeholderTextColor="#A09B95"
                  value={bio}
                  onChangeText={setBio}
                  maxLength={200}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <Pressable
                onPress={profileForm.handleSubmit(saveProfile)}
                disabled={saving}
                className="h-11 items-center justify-center rounded-xl bg-[#A81245] disabled:opacity-50">
                <Text className="text-sm font-semibold text-white">
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Text>
              </Pressable>

              {message && (
                <View
                  className={`rounded-2xl border p-4 ${
                    message.kind === 'ok'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}>
                  <Text
                    className={`text-center text-sm font-medium ${
                      message.kind === 'ok' ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {message.text}
                  </Text>
                </View>
              )}
            </View>
          </SectionCard>
        </View>
      </View>
    </ScrollView>
  );
}

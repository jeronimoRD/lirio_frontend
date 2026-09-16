import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowLeft, UserRound } from 'lucide-react-native';

import { updateProfile } from '../../src/api/users';
import Field from '../../src/components/Field';
import { useSession } from '../../src/session/context';

type ProfileForm = {
  name: string;
};

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};

function IconWell({ children }: { children: ReactNode }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F4EEE7]">
      {children}
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09B95]">
      {text}
    </Text>
  );
}

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <View className="gap-4 rounded-2xl bg-white p-4" style={cardShadow}>
      {children}
    </View>
  );
}

function SectionHeaderRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <IconWell>{icon}</IconWell>
      <Text className="flex-1 text-sm font-semibold text-[#292724]">{label}</Text>
    </View>
  );
}

export default function EditProfile() {
  const { user, refreshUser } = useSession();
  const router = useRouter();

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
      contentContainerClassName="items-center px-5 pt-6 pb-10">
      <View className="w-full max-w-[390px] gap-6">
        {/* Edit-profile header */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            style={cardShadow}>
            <ArrowLeft size={20} color="#A81245" strokeWidth={2} />
          </Pressable>

          <Text className="flex-1 text-center text-xl font-bold text-[#292724]">Editar perfil</Text>

          <View className="h-11 w-11" />
        </View>

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
                rules={{
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
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
            </View>
          </SectionCard>
        </View>

        {/* Mensajes de resultado */}
        {message && (
          <View
            className={`rounded-2xl border p-4 ${
              message.kind === 'ok' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
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
    </ScrollView>
  );
}

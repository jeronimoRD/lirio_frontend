import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../ScreenHeader';
import Field from '../Field';
import { SectionCard, SectionHeaderRow, SectionLabel } from '../SettingsSections';
import { useEditProfile } from '../../hooks/settings/useEditProfile';

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const { user, control, bio, setBio, saving, message, submit, goBack } = useEditProfile();

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="items-center px-5"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }}>
      <View className="w-full max-w-[390px] gap-6">
        <ScreenHeader title="Editar perfil" onBack={goBack} />

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
                control={control}
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
                onPress={submit}
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
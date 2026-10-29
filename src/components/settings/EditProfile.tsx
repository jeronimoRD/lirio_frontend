
import { useState } from 'react';
import { Redirect } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Check,
  ChevronRight,
  Sparkles,
  UserRound,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../ScreenHeader';
import Field from '../Field';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import {
  SectionCard,
  SectionHeaderRow,
  SectionLabel,
} from '../SettingsSections';
import { useEditProfile } from '../../hooks/settings/useEditProfile';

const COLORS = {
  background: '#FCFAF8',
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
  muted: '#A09B95',
};

function EditorialMark() {
  return (
    <View
      className="flex-row items-center gap-2"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View className="h-px w-7 bg-beige" />
      <View className="h-1 w-1 rounded-full bg-brand" />
      <View className="h-px w-7 bg-beige" />
    </View>
  );
}

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [bioFocused, setBioFocused] = useState(false);

  const {
    user,
    control,
    bio,
    setBio,
    saving,
    message,
    submit,
    goBack,
  } = useEditProfile();

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-screen"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="items-center px-5"
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 40,
      }}>

      <View className="w-full max-w-[390px] gap-6">

        {/* Encabezado editorial */}
        <View>
          <ScreenHeader title="Editar perfil" onBack={goBack} />

          <View className="mt-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-['Lora-Italic'] text-[29px] leading-[37px] text-ink">
                  Tu esencia, tus palabras.
                </Text>

                <Text className="mt-2 text-[13px] leading-5 text-ink-secondary">
                  Haz que tu perfil refleje quién eres y cómo expresas tu
                  estilo.
                </Text>
              </View>

              <View className="h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
                <Sparkles
                  size={20}
                  color={COLORS.burgundy}
                  strokeWidth={1.4}
                />
              </View>
            </View>

            <View className="mt-5 flex-row items-center gap-2">
              <EditorialMark />

              <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                HIBIRIO · Tu estilo
              </Text>

              <View className="h-px flex-1 bg-line" />
            </View>
          </View>
        </View>

        {/* Vista previa del perfil */}
        <View>
          <SectionLabel text="TU IDENTIDAD" />

          <View className="mt-2 overflow-hidden rounded-[22px] border border-line bg-white">
            <View className="h-[70px] bg-brand" />

            <View className="px-4 pb-5">
              <View className="-mt-8 mb-3 h-[66px] w-[66px] items-center justify-center rounded-full border-[3px] border-white bg-screen">
                <UserRound
                  size={30}
                  color={COLORS.burgundy}
                  strokeWidth={1.25}
                />
              </View>

              <Text className="font-['Lora-Italic'] text-[23px] text-ink">
                {user.name || 'Tu nombre'}
              </Text>

              <Text className="mt-1 text-[12px] text-ink-secondary">
                Tu perfil en la comunidad Hibirio refleja tu estilo y personalidad. Haz que cada palabra cuente.
              </Text>

              <View className="mt-4 flex-row items-center gap-2">
                <View className="rounded-full border border-line bg-screen px-3 py-1.5">
                  <Text className="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-secondary">
                    Mi espacio
                  </Text>
                </View>

                <View className="h-1 w-1 rounded-full bg-beige" />

                <Text className="text-[10px] text-ink-muted">
                  Tu historia comienza aquí
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formulario */}
        <View className="gap-2.5">
          <SectionLabel text="PERFIL" />

          <SectionCard>
            <SectionHeaderRow
              icon={<UserRound size={18} color={COLORS.burgundy} />}
              label="Nombre y biografía"
            />

            <View className="gap-5">

              {/* Nombre */}
              <Field
                control={control}
                name="name"
                label="Nombre"
                labelClassName="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-secondary"
                inputWrapperClassName="h-[52px] flex-row items-center rounded-xl border border-line bg-screen px-4"
                inputClassName="flex-1 text-sm text-ink"
                maxLength={50}
                rules={{
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Máximo 50 caracteres',
                  },
                }}
              />

              {/* Biografía */}
              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-secondary">
                    Biografía
                  </Text>

                  <Text className="text-[10px] text-ink-muted">
                    Hasta 200 caracteres
                  </Text>
                </View>

                <View
                  className="overflow-hidden rounded-xl border border-line bg-screen"
                  style={bioFocused ? { borderColor: '#A81245' } : undefined}>
                  <TextInput
                    className="min-h-[125px] p-4 text-sm leading-[22px] text-ink"
                    placeholder="Cuéntanos algo sobre ti, tus gustos o tu forma de vivir la moda..."
                    placeholderTextColor={COLORS.muted}
                    value={bio}
                    onChangeText={setBio}
                    onFocus={() => setBioFocused(true)}
                    onBlur={() => setBioFocused(false)}
                    maxLength={200}
                    multiline
                    textAlignVertical="top"
                    accessibilityLabel="Biografía"
                  />

                  <View className="flex-row items-center justify-between border-t border-line px-4 py-3">
                    <View className="flex-row items-center gap-2">
                      <View className="h-1.5 w-1.5 rounded-full bg-beige" />

                      <Text className="text-[10px] text-ink-secondary">
                        Tu historia, a tu manera
                      </Text>
                    </View>

                    <Text className="text-[10px] text-ink-muted">
                      {bio.length}/200
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mensaje de estado */}
              {message && (
                <View
                  className={`overflow-hidden rounded-2xl ${
                    message.kind === 'ok'
                      ? 'border border-green-200 bg-green-50'
                      : 'border border-red-200 bg-red-50'
                  }`}>
                  <View className="flex-row items-start gap-3 p-4">
                    <View className="mt-0.5">
                      {message.kind === 'ok' ? (
                        <Check size={17} color="#15803D" />
                      ) : (
                        <Sparkles size={17} color="#B91C1C" />
                      )}
                    </View>

                    <Text
                      className={`flex-1 text-[12px] leading-5 ${
                        message.kind === 'ok'
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}>
                      {message.text}
                    </Text>
                  </View>
                </View>
              )}

              {/* Guardar cambios */}
              <Pressable
                onPress={() => submit()}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel="Guardar cambios del perfil"
                className="overflow-hidden rounded-full bg-brand disabled:opacity-50"
                style={{
                  shadowColor: '#A81245',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.16,
                  shadowRadius: 9,
                  elevation: 3,
                }}>
                <View className="min-h-[50px] flex-row items-center justify-center gap-2 px-5">
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Check size={16} color="#FFFFFF" />

                      <Text className="text-[12px] font-semibold tracking-[0.04em] text-white">
                        Guardar cambios
                      </Text>

                      <ChevronRight size={15} color="#FFFFFF" />
                    </>
                  )}
                </View>
              </Pressable>

              <Text className="text-center text-[10px] leading-4 text-ink-muted">
                Un pequeño cambio puede decir mucho de ti.
              </Text>
            </View>
          </SectionCard>
        </View>

        {/* Detalle Liquid Glass */}
        <View className="overflow-hidden rounded-card">
          <View className="h-[108px] overflow-hidden rounded-card bg-ink">
            <View className="absolute -right-5 -top-9 h-32 w-32 rounded-full border border-white/10" />
            <View className="absolute -right-1 -top-5 h-24 w-24 rounded-full border border-white/10" />
            <View className="absolute -bottom-12 -left-5 h-32 w-32 rounded-full border border-white/10" />

            <GlassSurface
              intensity={35}
              tintColor="rgba(252, 250, 248, 0.10)"
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 15,
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <Sparkles
                    size={19}
                    color={COLORS.champagne}
                    strokeWidth={1.4}
                  />
                </View>

                <View className="flex-1">
                  <Text className="font-['Lora-Italic'] text-[18px] text-white">
                    Tu perfil, tu universo.
                  </Text>

                  <Text className="mt-1 text-[11px] leading-4 text-white/70">
                    La moda también es una forma de contar tu historia.
                  </Text>
                </View>
              </View>
            </GlassSurface>
          </View>
        </View>

        <View className="items-center pb-2">
          <EditorialMark />

          <Text className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            HIBIRIO
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

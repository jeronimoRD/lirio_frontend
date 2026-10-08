import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Bell, ChevronRight, Lock, Mail, TriangleAlert } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../ScreenHeader';
import ConfirmModal from '../ConfirmModal';
import Field from '../Field';
import { IconWell, SectionCard, SectionHeaderRow, SectionLabel } from '../SettingsSections';
import type { ResultMessage } from '../../utils/resultMessage';
import { useSettings } from '../../hooks/settings/useSettings';

function ResultBanner({ message }: { message: ResultMessage | null }) {
  if (!message) return null;

  return (
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
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <IconWell>{icon}</IconWell>
      <Text className="flex-1 text-sm font-medium text-[#292724]">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#EAE6E1', true: '#A81245' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function Settings() {
  const insets = useSafeAreaInsets();
  const {
    user,
    goBack,
    profileControl,
    submitProfile,
    savingProfile,
    profileMessage,
    passwordControl,
    submitPassword,
    validateConfirm,
    savingPassword,
    passwordMessage,
    pushEnabled,
    setPushEnabled,
    emailEnabled,
    setEmailEnabled,
    deleting,
    deleteMessage,
    confirmingDelete,
    askDeleteConfirmation,
    cancelDeleteConfirmation,
    removeAccount,
  } = useSettings();

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="items-center px-5"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }}>
      <View className="w-full max-w-[390px] gap-6">
        <ScreenHeader title="Configuración" onBack={goBack} />

        {/* Cuenta */}
        <View className="gap-2.5">
          <SectionLabel text="CUENTA" />
          <SectionCard>
            <SectionHeaderRow
              icon={<Mail size={18} color="#A81245" />}
              label="Correo electrónico"
            />

            <View className="gap-4">
              <Field
                control={profileControl}
                name="email"
                label="Correo electrónico"
                keyboardType="email-address"
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={100}
                rules={{
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Ingresa un correo válido',
                  },
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                }}
              />

              <Pressable
                onPress={submitProfile}
                disabled={savingProfile}
                className="h-11 items-center justify-center rounded-xl bg-[#A81245] disabled:opacity-50">
                <Text className="text-sm font-semibold text-white">
                  {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                </Text>
              </Pressable>

              <ResultBanner message={profileMessage} />
            </View>
          </SectionCard>
        </View>

        {/* Seguridad */}
        <View className="gap-2.5">
          <SectionLabel text="SEGURIDAD" />
          <SectionCard>
            <SectionHeaderRow icon={<Lock size={18} color="#A81245" />} label="Contraseña" />

            <View className="gap-4">
              <Field
                control={passwordControl}
                name="password"
                label="Contraseña nueva"
                secureTextEntry
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={128}
                rules={{
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                  maxLength: { value: 128, message: 'Máximo 128 caracteres' },
                }}
              />

              <Field
                control={passwordControl}
                name="confirm"
                label="Confirmar contraseña"
                secureTextEntry
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={128}
                rules={{
                  required: 'Confirma la contraseña',
                  validate: validateConfirm,
                }}
              />

              <Pressable
                onPress={submitPassword}
                disabled={savingPassword}
                className="h-11 items-center justify-center rounded-xl bg-[#A81245] disabled:opacity-50">
                <Text className="text-sm font-semibold text-white">
                  {savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
                </Text>
              </Pressable>

              <ResultBanner message={passwordMessage} />
            </View>
          </SectionCard>
        </View>

        {/* Notificaciones */}
        <View className="gap-2.5">
          <SectionLabel text="NOTIFICACIONES" />
          <SectionCard>
            <ToggleRow
              icon={<Bell size={18} color="#A81245" />}
              label="Notificaciones push"
              value={pushEnabled}
              onChange={setPushEnabled}
            />
            <View className="h-px bg-[#EAE6E1]" />
            <ToggleRow
              icon={<Mail size={18} color="#A81245" />}
              label="Correos de novedades"
              value={emailEnabled}
              onChange={setEmailEnabled}
            />
          </SectionCard>
        </View>

        {/* Zona de peligro */}
        <View className="gap-2.5">
          <SectionLabel text="ZONA DE PELIGRO" />
          <SectionCard>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <TriangleAlert size={18} color="#DC2626" />
              </View>
              <Text className="flex-1 text-sm font-semibold text-red-700">Eliminar cuenta</Text>
              {!confirmingDelete && <ChevronRight size={16} color="#A09B95" />}
            </View>

            <Text className="text-xs leading-[18px] text-[#6E6B68]">
              Al eliminar tu cuenta se borrarán también tus publicaciones. Esta acción no se puede
              deshacer.
            </Text>

            <Pressable
              onPress={askDeleteConfirmation}
              disabled={deleting}
              className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-[#E9AFA6] bg-[#FBE6E1] active:opacity-80 disabled:opacity-50">
              <Text className="text-[13px] font-semibold text-[#C2391F]">Eliminar cuenta</Text>
            </Pressable>

            <ResultBanner message={deleteMessage} />
          </SectionCard>
        </View>

        <ConfirmModal
          visible={confirmingDelete}
          title="¿Eliminar tu cuenta?"
          message="Se eliminarán tu cuenta y todas tus publicaciones de forma permanente. Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          danger
          loading={deleting}
          onConfirm={removeAccount}
          onCancel={cancelDeleteConfirmation}
        />
      </View>
    </ScrollView>
  );
}
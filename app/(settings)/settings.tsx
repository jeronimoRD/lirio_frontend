import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { ArrowLeft, Bell, ChevronRight, Lock, Mail, TriangleAlert } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteAccount, updatePassword, updateProfile } from '../../src/api/users';
import ConfirmModal from '../../src/components/ConfirmModal';
import Field from '../../src/components/Field';
import { useSession } from '../../src/session/context';

type ProfileForm = {
  email: string;
};

type PasswordForm = {
  password: string;
  confirm: string;
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

function ResultBanner({
  message,
}: {
  message: { kind: 'ok' | 'error'; text: string } | null;
}) {
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
  const { user, signOut, refreshUser } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const newPassword = useWatch({
    control: passwordForm.control,
    name: 'password',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  const saveProfile = async (data: ProfileForm) => {
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
        {/* Settings header */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            style={cardShadow}>
            <ArrowLeft size={20} color="#A81245" strokeWidth={2} />
          </Pressable>

          <Text className="flex-1 text-center text-xl font-bold text-[#292724]">Configuración</Text>

          <View className="h-11 w-11" />
        </View>

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
                control={profileForm.control}
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
                onPress={profileForm.handleSubmit(saveProfile)}
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
                control={passwordForm.control}
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
                control={passwordForm.control}
                name="confirm"
                label="Confirmar contraseña"
                secureTextEntry
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={128}
                rules={{
                  required: 'Confirma la contraseña',
                  validate: (value) => value === newPassword || 'Las contraseñas no coinciden',
                }}
              />

              <Pressable
                onPress={passwordForm.handleSubmit(savePassword)}
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
              onPress={() => setConfirmingDelete(true)}
              disabled={deleting}
              className="h-11 items-center justify-center rounded-xl border border-red-200 disabled:opacity-50">
              <Text className="text-sm font-semibold text-red-600">Eliminar cuenta</Text>
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
          onCancel={() => setConfirmingDelete(false)}
        />
      </View>
    </ScrollView>
  );
}

import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Lock,
  Mail,
  MessageCircle,
  TriangleAlert,
  UserRound,
} from 'lucide-react-native';

import {
  deleteAccount,
  updatePassword,
  updateProfile,
} from '../../src/api/users';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import { useSession } from '../../src/session/context';

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  password: string;
  confirm: string;
};

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}

// --- Piezas visuales reutilizables de la lista de settings ---

function IconWell({ children }: { children: ReactNode }) {
  return (
    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F4EEE7]">
      {children}
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A09B95]">
      {text}
    </Text>
  );
}

// Fila de encabezado de sección: ícono + texto, sin acción de navegación
// (las secciones aquí despliegan su formulario debajo, en vez de llevar a
// otra pantalla, para no tener que crear rutas nuevas).
function SectionHeaderRow({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="h-[52px] flex-row items-center gap-3">
      <IconWell>{icon}</IconWell>
      <Text className="flex-1 text-sm font-medium text-[#292724]">{label}</Text>
    </View>
  );
}

// Fila simple tipo toggle (solo visual por ahora, ver TODOs abajo).
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
    <View className="h-[52px] flex-row items-center gap-3">
      <IconWell>{icon}</IconWell>
      <Text className="flex-1 text-sm font-medium text-[#292724]">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#EAE6E1', true: '#DCC7A8' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function Settings() {
  const { user, signOut, refreshUser } = useSession();
  const router = useRouter();

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
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

  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [message, setMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  // TODO: solo visual — no hay endpoint de preferencias de notificaciones
  // todavía, así que estos dos toggles no persisten nada por ahora.
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  const saveProfile = async (data: ProfileForm) => {
    setMessage(null);
    setSavingProfile(true);

    try {
      await updateProfile(data.name.trim(), data.email.trim().toLowerCase());
      await refreshUser();
      setMessage({ kind: 'ok', text: 'Datos actualizados correctamente' });
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (data: PasswordForm) => {
    setMessage(null);
    setSavingPassword(true);

    try {
      await updatePassword(data.password);
      passwordForm.reset();
      setMessage({ kind: 'ok', text: 'Contraseña actualizada correctamente' });
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const removeAccount = async () => {
    setMessage(null);
    setDeleting(true);

    try {
      await deleteAccount();
      signOut();
      // signOut deja user en null: el Redirect de arriba lo lleva al login.
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
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
      contentContainerClassName="items-center px-[22px] pt-6 pb-10"
    >
      <View className="w-full max-w-[346px] gap-5">
        {/* Settings header */}
        <View className="h-[52px] flex-row items-center">
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center"
          >
            <ArrowLeft size={22} color="#DCC7A8" strokeWidth={2} />
          </Pressable>

          <Text className="flex-1 text-center text-xl font-bold text-[#292724]">
            Configuración
          </Text>

          <View className="h-11 w-11" />
        </View>

        {/* Cuenta */}
        <View className="gap-[3px]">
          <SectionLabel text="CUENTA" />
          <SectionHeaderRow icon={<UserRound size={16} color="#6E6B68" />} label="Nombre y correo" />

          <View className="gap-4 pb-2 pl-11">
            <Field
              control={profileForm.control}
              name="name"
              label="Nombre"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
              rules={{
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres',
                },
              }}
            />

            <Field
              control={profileForm.control}
              name="email"
              label="Correo electrónico"
              keyboardType="email-address"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
              rules={{
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Ingresa un correo válido',
                },
              }}
            />

            {/* Bio: solo visual por ahora, sin endpoint todavía */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
                Bibliografía
              </Text>
              <TextInput
                className="min-h-24 rounded-lg border border-[#EAE6E1] bg-white p-3 text-sm text-[#292724]"
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
              disabled={savingProfile}
              className="h-11 items-center justify-center rounded-full bg-[#DCC7A8] disabled:opacity-50"
            >
              <Text className="text-sm font-semibold text-white">
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Seguridad */}
        <View className="gap-[3px]">
          <SectionLabel text="SEGURIDAD" />
          <SectionHeaderRow icon={<Lock size={16} color="#6E6B68" />} label="Contraseña" />

          <View className="gap-4 pb-2 pl-11">
            <Field
              control={passwordForm.control}
              name="password"
              label="Contraseña nueva"
              secureTextEntry
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
              rules={{
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              }}
            />

            <Field
              control={passwordForm.control}
              name="confirm"
              label="Confirmar contraseña"
              secureTextEntry
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
              rules={{
                validate: (value) =>
                  value === newPassword || 'Las contraseñas no coinciden',
              }}
            />

            <Pressable
              onPress={passwordForm.handleSubmit(savePassword)}
              disabled={savingPassword}
              className="h-11 items-center justify-center rounded-full bg-[#DCC7A8] disabled:opacity-50"
            >
              <Text className="text-sm font-semibold text-white">
                {savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Notificaciones */}
        <View className="gap-[3px]">
          <SectionLabel text="NOTIFICACIONES" />
          <ToggleRow
            icon={<Bell size={16} color="#6E6B68" />}
            label="Notificaciones push"
            value={pushEnabled}
            onChange={setPushEnabled}
          />
          <ToggleRow
            icon={<Mail size={16} color="#6E6B68" />}
            label="Correos de novedades"
            value={emailEnabled}
            onChange={setEmailEnabled}
          />
        </View>

        {/* Zona de peligro */}
        <View className="gap-[3px]">
          <SectionLabel text="ZONA DE PELIGRO" />

          <View className="h-[52px] flex-row items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <TriangleAlert size={16} color="#DC2626" />
            </View>
            <Text className="flex-1 text-sm font-medium text-red-700">
              Eliminar cuenta
            </Text>
            {!confirmingDelete && <ChevronRight size={14} color="#A09B95" />}
          </View>

          <View className="gap-3 pb-2 pl-11">
            <Text className="text-xs text-[#6E6B68]">
              Al eliminar tu cuenta se borrarán también tus publicaciones. Esta
              acción no se puede deshacer.
            </Text>

            {confirmingDelete ? (
              <View className="gap-3">
                <Pressable
                  onPress={removeAccount}
                  disabled={deleting}
                  className="h-11 items-center justify-center rounded-full bg-red-600 disabled:opacity-50"
                >
                  <Text className="text-sm font-semibold text-white">
                    {deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="h-11 items-center justify-center rounded-full border border-[#EAE6E1]"
                >
                  <Text className="text-sm font-semibold text-[#292724]">
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => setConfirmingDelete(true)}
                className="h-11 items-center justify-center rounded-full border border-red-200"
              >
                <Text className="text-sm font-semibold text-red-600">
                  Eliminar cuenta
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Mensajes de resultado */}
        {message && (
          <View
            className={`rounded-xl border p-4 ${
              message.kind === 'ok'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                message.kind === 'ok' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message.text}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
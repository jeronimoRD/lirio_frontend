
import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Heart,
  History,
  Lock,
  Mail,
  Settings as SettingsIcon,
  TriangleAlert,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../ScreenHeader';
import ConfirmModal from '../ConfirmModal';
import Field from '../Field';
import {
  IconWell,
  SectionCard,
  SectionHeaderRow,
  SectionLabel,
} from '../SettingsSections';
import type { ResultMessage } from '../../utils/resultMessage';
import { useSettings } from '../../hooks/settings/useSettings';
import { useLikedPosts } from '../../hooks/tabs/useSaved';
import { formatLikeCount } from '../../utils/format';

const COLORS = {
  background: '#FCFAF8',
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
  sage: '#3D6B52',
};

function ResultBanner({ message }: { message: ResultMessage | null }) {
  if (!message) return null;

  const success = message.kind === 'ok';

  return (
    <View
      accessibilityRole="alert"
      className={`rounded-xl border p-3 ${
        success
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <Text
        className={`text-sm leading-5 ${
          success ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {message.text}
      </Text>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <IconWell>{icon}</IconWell>

      <View className="flex-1 gap-1">
        <Text className="text-sm font-semibold text-ink">
          {label}
        </Text>
        <Text className="text-xs leading-[18px] text-ink-secondary">
          {description}
        </Text>
      </View>

      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: COLORS.border,
          true: COLORS.burgundy,
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SettingsTab({
  active,
  icon,
  title,
  onPress,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl px-3 py-3 ${
        active ? 'bg-brand' : 'bg-transparent'
      }`}
    >
      {icon}
      <Text
        className={`text-[13px] font-semibold ${
          active ? 'text-white' : 'text-ink-secondary'
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'config' | 'history'>(
    'config',
  );

  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  const {
    likedPosts,
    loading: likedLoading,
  } = useLikedPosts();

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  const goToPost = (id: string) => {
    router.push({
      pathname: '/(upload)/[id]',
      params: { id },
    });
  };

  const showHistory = activeTab === 'history';
  const historyData = showHistory && !likedLoading ? likedPosts : [];

  return (
    <View className="flex-1 bg-screen">
      <FlatList
        className="flex-1"
        data={historyData}
        keyExtractor={(post) => post.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 32,
        }}
        renderItem={({ item }) => (
          <View className="pb-3">
            <Pressable
              onPress={() => goToPost(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Ver publicación ${item.title}`}
              className="flex-row items-center gap-3 rounded-xl border border-line bg-screen p-2.5 active:opacity-80"
            >
              <Image
                source={{ uri: item.image }}
                className="h-[86px] w-[72px] rounded-lg"
                resizeMode="cover"
              />

              <View className="flex-1 gap-2">
                <Text
                  numberOfLines={2}
                  className="font-['Lora-Italic'] text-base leading-5 text-ink"
                >
                  {item.title}
                </Text>

                <View className="flex-row items-center gap-1.5">
                  <Heart
                    size={13}
                    color={COLORS.burgundy}
                    fill={COLORS.burgundy}
                  />
                  <Text className="text-xs text-ink-secondary">
                    {formatLikeCount(item.likesCount ?? 0)} Me gusta
                  </Text>
                </View>
              </View>

              <ChevronRight size={17} color="#A09B95" />
            </Pressable>
          </View>
        )}
        ListHeaderComponent={
          <View>
            <ScreenHeader title="Configuración" onBack={goBack} />

            {/* Encabezado editorial */}
            <View className="mb-6 mt-5">
              <Text className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-brand">
                TU ESPACIO PERSONAL
              </Text>

              <Text className="font-['Lora-Italic'] text-[32px] leading-[40px] text-ink">
                Un lugar solo tuyo.
              </Text>

              <Text className="mt-2 max-w-[320px] text-sm leading-6 text-ink-secondary">
                Cuida tu cuenta, ajusta tus preferencias y vuelve a descubrir
                los looks que te inspiran.
              </Text>

              <View className="mt-5 h-px w-full bg-line" />

              <View className="mt-3 flex-row items-center gap-2">
                <View className="h-1.5 w-1.5 rounded-full bg-brand" />
                <Text className="text-[10px] font-medium uppercase tracking-[1.5px] text-ink-muted">
                  HIBIRIO - TU BIENESTAR
                </Text>
              </View>
            </View>

            {/* Navegación superior */}
            <View
              accessibilityRole="tablist"
              className="mb-7 flex-row rounded-2xl border border-line bg-white p-1.5"
            >
              <SettingsTab
                active={activeTab === 'config'}
                title="Configuración"
                icon={
                  <SettingsIcon
                    size={16}
                    color={activeTab === 'config' ? '#FFFFFF' : '#6E6B68'}
                  />
                }
                onPress={() => setActiveTab('config')}
              />

              <SettingsTab
                active={activeTab === 'history'}
                title="Mi historial"
                icon={
                  <History
                    size={16}
                    color={activeTab === 'history' ? '#FFFFFF' : '#6E6B68'}
                  />
                }
                onPress={() => setActiveTab('history')}
              />
            </View>

            {activeTab === 'config' ? (
              <View className="gap-7">
                {/* Cuenta */}
                <View className="gap-3">
                  <SectionLabel text="01 / CUENTA" />

                  <SectionCard>
                    <SectionHeaderRow
                      icon={<Mail size={18} color={COLORS.burgundy} />}
                      label="Correo electrónico"
                    />

                    <Text className="mb-4 mt-2 text-xs leading-5 text-ink-secondary">
                      Gestiona el correo asociado a tu cuenta de Hibirio.
                    </Text>

                    <View className="gap-4">
                      <Field
                        control={profileControl}
                        name="email"
                        label="Correo electrónico"
                        keyboardType="email-address"
                        labelClassName="text-xs font-semibold uppercase tracking-wide text-ink-secondary"
                        inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                        inputClassName="flex-1 text-sm text-ink"
                        maxLength={100}
                        rules={{
                          required: 'El correo es obligatorio',
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Ingresa un correo válido',
                          },
                          maxLength: {
                            value: 100,
                            message: 'Máximo 100 caracteres',
                          },
                        }}
                      />

                      <Pressable
                        onPress={() => submitProfile()}
                        disabled={savingProfile}
                        className="h-12 flex-row items-center justify-center rounded-xl bg-brand active:opacity-80 disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text className="text-sm font-semibold text-white">
                            Guardar cambios
                          </Text>
                        )}
                      </Pressable>

                      <ResultBanner message={profileMessage} />
                    </View>
                  </SectionCard>
                </View>

                {/* Seguridad */}
                <View className="gap-3">
                  <SectionLabel text="02 / SEGURIDAD" />

                  <SectionCard>
                    <SectionHeaderRow
                      icon={<Lock size={18} color={COLORS.burgundy} />}
                      label="Contraseña"
                    />

                    <Text className="mb-4 mt-2 text-xs leading-5 text-ink-secondary">
                      Mantén tu cuenta protegida con una contraseña segura.
                    </Text>

                    <View className="gap-4">
                      <Field
                        control={passwordControl}
                        name="password"
                        label="Contraseña nueva"
                        secureTextEntry
                        labelClassName="text-xs font-semibold uppercase tracking-wide text-ink-secondary"
                        inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                        inputClassName="flex-1 text-sm text-ink"
                        maxLength={128}
                        rules={{
                          required: 'La contraseña es obligatoria',
                          minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres',
                          },
                          maxLength: {
                            value: 128,
                            message: 'Máximo 128 caracteres',
                          },
                        }}
                      />

                      <Field
                        control={passwordControl}
                        name="confirm"
                        label="Confirmar contraseña"
                        secureTextEntry
                        labelClassName="text-xs font-semibold uppercase tracking-wide text-ink-secondary"
                        inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                        inputClassName="flex-1 text-sm text-ink"
                        maxLength={128}
                        rules={{
                          required: 'Confirma la contraseña',
                          validate: validateConfirm,
                        }}
                      />

                      <Pressable
                        onPress={() => submitPassword()}
                        disabled={savingPassword}
                        className="h-12 flex-row items-center justify-center rounded-xl bg-brand active:opacity-80 disabled:opacity-50"
                      >
                        {savingPassword ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text className="text-sm font-semibold text-white">
                            Cambiar contraseña
                          </Text>
                        )}
                      </Pressable>

                      <ResultBanner message={passwordMessage} />
                    </View>
                  </SectionCard>
                </View>

                {/* Notificaciones */}
                <View className="gap-3">
                  <SectionLabel text="03 / PREFERENCIAS" />

                  <SectionCard>
                    <SectionHeaderRow
                      icon={<Bell size={18} color={COLORS.burgundy} />}
                      label="Notificaciones"
                    />

                    <Text className="mb-3 mt-2 text-xs leading-5 text-ink-secondary">
                      Decide cómo quieres recibir novedades de Hibirio.
                    </Text>

                    <ToggleRow
                      icon={<Bell size={18} color={COLORS.burgundy} />}
                      label="Notificaciones push"
                      description="Avisos y novedades en tu dispositivo."
                      value={pushEnabled}
                      onChange={setPushEnabled}
                    />

                    <View className="my-3 h-px bg-line" />

                    <ToggleRow
                      icon={<Mail size={18} color={COLORS.burgundy} />}
                      label="Correos de novedades"
                      description="Actualizaciones y noticias por correo."
                      value={emailEnabled}
                      onChange={setEmailEnabled}
                    />
                  </SectionCard>
                </View>

                {/* Zona de peligro */}
                <View className="gap-3">
                  <SectionLabel text="04 / ZONA DE PELIGRO" />

                  <View className="gap-4 rounded-2xl border border-[#F0D6D1] bg-[#FFF8F6] p-5">
                    <View className="flex-row items-center gap-3">
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-admin-danger-bg">
                        <TriangleAlert size={19} color="#C2391F" />
                      </View>

                      <View className="flex-1 gap-1">
                        <Text className="text-sm font-semibold text-[#A92F20]">
                          Eliminar cuenta
                        </Text>
                        <Text className="text-xs text-[#8D615B]">
                          Acción permanente
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm leading-6 text-ink-secondary">
                      Al eliminar tu cuenta se borrarán también tus publicaciones.
                      Esta acción no se puede deshacer.
                    </Text>

                    <Pressable
                      onPress={askDeleteConfirmation}
                      disabled={deleting}
                      className="h-11 flex-row items-center justify-center gap-2 rounded-xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50"
                    >
                      {deleting ? (
                        <ActivityIndicator color="#C2391F" />
                      ) : (
                        <>
                          <TriangleAlert size={15} color="#C2391F" />
                          <Text className="text-sm font-semibold text-admin-danger">
                            Eliminar cuenta
                          </Text>
                        </>
                      )}
                    </Pressable>

                    <ResultBanner message={deleteMessage} />
                  </View>
                </View>
              </View>
            ) : (
              /* Historial */
              <View className="gap-4 pb-4">
                <View className="gap-2">
                  <SectionLabel text="TU ARCHIVO PERSONAL" />

                  <Text className="font-['Lora-Italic'] text-[27px] leading-9 text-ink">
                    Looks que te inspiran.
                  </Text>

                  <Text className="text-sm leading-6 text-ink-secondary">
                    Una colección de publicaciones a las que les has dado me gusta.
                  </Text>
                </View>

                <SectionCard>
                  <SectionHeaderRow
                    icon={<Heart size={18} color={COLORS.burgundy} />}
                    label="Posts que me han gustado"
                  />
                </SectionCard>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          showHistory ? (
            likedLoading ? (
              <View className="items-center py-12">
                <ActivityIndicator color={COLORS.burgundy} />
                <Text className="mt-3 text-xs text-ink-secondary">
                  Cargando tu colección...
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-2xl border border-line bg-screen px-5 py-9">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-[#F4E8EC]">
                  <Heart size={25} color={COLORS.burgundy} />
                </View>

                <Text className="text-center font-['Lora-Italic'] text-xl text-ink">
                  Tu colección comienza aquí.
                </Text>

                <Text className="mt-2 text-center text-sm leading-6 text-ink-secondary">
                  Cuando marques un outfit con el corazón, aparecerá en
                  este espacio para que puedas volver a él.
                </Text>
              </View>
            )
          ) : undefined
        }
        ListFooterComponent={
          <View className="mt-8 items-center">
            <Text className="font-['Lora-Italic'] text-sm text-ink-muted">
              HIBIRIO · Tu estilo, tu historia.
            </Text>
          </View>
        }
      />

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
  );
}

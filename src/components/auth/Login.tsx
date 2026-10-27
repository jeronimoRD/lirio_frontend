import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import Field from '@/components/Field';
import HeroScreen from '@/components/LiquidGlass/HeroScreen';
import { useLogin } from '@/hooks/auth/useLogin';

const HERO_IMAGE = require('../../../assets/Romantic Hibiscus and Stargazer Lily Arrangement.png');

const LABEL = 'text-xs font-semibold uppercase text-[#6E6B68]';

const INPUT_WRAPPER =
  'h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4';

const INPUT = 'flex-1 text-sm text-[#292724]';

export default function Login() {
  const {
    control,
    showPassword,
    togglePassword,
    isSubmitting,
    rootError,
    submit,
  } = useLogin();

  return (
    <HeroScreen
      image={HERO_IMAGE}
      title="Iniciar sesión"
      subtitle="Tu estilo, tu esencia"
    >
      <View className="gap-6 px-6">
        {/* Campos del formulario */}
        <View className="gap-4">
          <Field
            control={control}
            name="email"
            label="Correo electrónico"
            keyboardType="email-address"
            placeholder="nombre@correo.com"
            labelClassName={LABEL}
            inputWrapperClassName={INPUT_WRAPPER}
            inputClassName={INPUT}
            maxLength={100}
            rules={{
              required: 'El correo es obligatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            }}
          />

          <Field
            control={control}
            name="password"
            label="Contraseña"
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            labelClassName={LABEL}
            inputWrapperClassName={INPUT_WRAPPER}
            inputClassName={INPUT}
            maxLength={128}
            rules={{ required: 'La contraseña es obligatoria' }}
            rightElement={
              <Pressable
                onPress={togglePassword}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                <Text className="text-xs font-medium text-[#A81245]">
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            }
          />

          {/* TODO: conectar cuando exista el flujo de recuperación */}
          <Pressable accessibilityRole="button">
            <Text className="text-right text-xs font-medium text-[#A81245]">
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>
        </View>

        {/* Error del login */}
        {rootError && (
          <View className="rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {rootError}
            </Text>
          </View>
        )}
      </View>

      {/* Botón y accesos sociales */}
      <View className="items-center gap-4 px-6 pt-6">
        <Pressable
          onPress={submit}
          disabled={isSubmitting}
          accessibilityRole="button"
          className="h-12 w-full items-center justify-center rounded-full bg-[#A81245] disabled:opacity-50"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text numberOfLines={1} className="text-sm font-semibold text-white">
              Iniciar sesión
            </Text>
          )}
        </Pressable>

        {/* Divisor */}
        <View className="w-full flex-row items-center gap-3">
          <View className="h-px flex-1 bg-[#EAE6E1]" />
          <Text className="text-[11px] font-medium uppercase text-[#A39E9A]">O</Text>
          <View className="h-px flex-1 bg-[#EAE6E1]" />
        </View>

        {/* TODO: conectar auth social */}
        <View className="w-full gap-2">
          <Pressable
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white"
          >
            <Ionicons name="logo-google" size={18} color="#292724" />
            <Text className="text-[13px] font-medium text-[#292724]">
              Continuar con Google
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white"
          >
            <Ionicons name="logo-apple" size={18} color="#292724" />
            <Text className="text-[13px] font-medium text-[#292724]">
              Continuar con Apple
            </Text>
          </Pressable>
        </View>

        <Link href="/register" asChild>
          <Pressable accessibilityRole="link" className="pb-8 pt-2">
            <Text className="text-[13px] text-[#6E6B68]">
              ¿No tienes una cuenta?{' '}
              <Text className="font-semibold text-[#A81245]">Crear cuenta</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </HeroScreen>
  );
}
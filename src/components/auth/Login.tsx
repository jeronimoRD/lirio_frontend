import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Field from '../Field';
import Button from '../Button';
import { useLogin } from '../../hooks/useLogin';

// TODO: reemplaza esta imagen por la tuya
const HERO_IMAGE = require('../../../assets/pexels-karen-f-1376469-8883181.jpg');

export default function Login() {
  const insets = useSafeAreaInsets();
  const { control, showPassword, togglePassword, isSubmitting, rootError, submit } = useLogin();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FCFAF8]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled">
        {/* hero-accent-block */}
        <ImageBackground
          source={HERO_IMAGE}
          resizeMode="cover"
          className="h-[280px] w-full justify-end overflow-hidden">
          <View className="absolute inset-0 bg-black/15" />
        </ImageBackground>

        {/* login-panel */}
        <View className="gap-6 px-6 pb-4 pt-8">
          {/* brand-logo */}
          <View className="items-center gap-0.5">
            <Text className="font-['Lora-Italic'] text-[32px] leading-[41px] text-[#A81245]">
              Hibirio
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wide text-[#A81245]">
              Tu estilo, tu esencia
            </Text>
          </View>

          {/* form-block */}
          <View className="gap-4">
            <Field
              control={control}
              name="email"
              label="Correo electrónico"
              keyboardType="email-address"
              placeholder="nombre@correo.com"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
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
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
              maxLength={128}
              rules={{ required: 'La contraseña es obligatoria' }}
              rightElement={
                <Pressable onPress={togglePassword} hitSlop={8}>
                  <Text className="text-xs font-medium text-[#292724]">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />

            {/* TODO: conectar cuando exista el flujo de recuperación */}
            <Pressable>
              <Text className="text-right text-xs font-medium text-[#A81245]">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>

          {rootError && (
            <View className="rounded-xl bg-red-50 p-4">
              <Text className="text-center text-sm font-medium text-pink-700">{rootError}</Text>
            </View>
          )}

          <Button
            text={isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            onPress={submit}
            disabled={isSubmitting}
            className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-[#A81245]"
            textClassName="text-sm font-semibold text-white"
          />

          {/* divider-block */}
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#EAE6E1]" />
            <Text className="text-[11px] font-medium uppercase text-[#292724]">O</Text>
            <View className="h-px flex-1 bg-[#EAE6E1]" />
          </View>

          {/* social-stack — TODO: conectar auth social */}
          <View className="gap-2">
            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Ionicons name="logo-google" size={18} color="#292724" />
              <Text className="text-[13px] font-medium text-[#292724]">Continuar con Google</Text>
            </Pressable>

            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Ionicons name="logo-apple" size={18} color="#292724" />
              <Text className="text-[13px] font-medium text-[#292724]">Continuar con Apple</Text>
            </Pressable>
          </View>
        </View>

        {/* footer-navigation */}
        <View className="items-center pb-8 pt-2">
          <Link href="/register" asChild>
            <Pressable>
              <Text className="text-[13px] text-[#6E6B68]">
                ¿No tienes una cuenta?{' '}
                <Text className="font-semibold text-[#A81245]">Crear cuenta</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
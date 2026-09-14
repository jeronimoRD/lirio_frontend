import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';

import Field from '../../src/components/Field';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';

type FormData = {
  email: string;
  password: string;
};

// TODO: reemplaza esta URI por tu propia imagen (por ejemplo con require('../../assets/hero-login.jpg'))
const HERO_IMAGE_URI = require('../../assets/pexels-karen-f-1376469-8883181.jpg');

export default function Login() {
  const { signIn } = useSession();
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      router.replace('/profile');
    } catch (err: any) {
      setError(err?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FCFAF8]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* hero-accent-block */}
        <ImageBackground
          source={HERO_IMAGE_URI}
          resizeMode="cover"
          imageStyle={{ transform: [{ translateY: -1 }] }}
          className="h-[280px] w-full justify-end overflow-hidden"
        >
          {/* overlay oscuro (equivalente al linear-gradient plano del diseño) */}
          <View className="absolute inset-0 bg-black/15" />
        </ImageBackground>

        {/* login-panel */}
        <View className="gap-6 px-6 pb-4 pt-8">
          {/* brand-logo */}
          <View className="items-center gap-0.5">
            {/* TODO: reemplaza por el nombre real de tu marca */}
            <Text className="font-['Lora'] text-[32px] italic leading-[41px] text-[#A81245]">
              Hibirio
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wide text-[#A81245]-0.2">
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
              rightElement={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Text className="text-xs font-medium text-[#292724]">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />

            {/* forgot-password */}
            {/* TODO: sin lógica de recuperación de contraseña todavía — conectar cuando exista el flujo */}
            <Pressable>
              <Text className="text-right text-xs font-medium text-[#A81245]">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>

            {/* MENSAJE DE ERROR */}
            {error && (
              <View className="mb-6 rounded-xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-pink-700">
                  {error}
                </Text>
              </View>
            )}

            {/* MENSAJE DE ÉXITO */}
            {success && (
              <View className="mb-6 rounded-xl bg-green-50 p-4">
                <Text className="text-center text-sm font-medium text-green-700">
                  ¡Has ingresado correctamente!
                </Text>
              </View>
            )}

          {/* login-action: btn-primary */}
          <Button
            text={loading ? 'Ingresando...' : 'Iniciar sesión'}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-[#A81245]"
            textClassName="text-sm font-semibold text-white"
          />

          {loading && (
            <View className="items-center">
              <ActivityIndicator />
            </View>
          )}

          {/* divider-block */}
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#EAE6E1]" />
            <Text className="text-[11px] font-medium uppercase text-[#292724]">O</Text>
            <View className="h-px flex-1 bg-[#EAE6E1]" />
          </View>

          {/* social-stack */}
          {/* TODO: sin lógica de auth social todavía — solo visual, conectar cuando exista el flujo */}
          <View className="gap-2">
            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Ionicons name="logo-google" size={18} color="#292724" />

              <Text className="text-[13px] font-medium text-[#292724]">
                Continuar con Google
              </Text>
            </Pressable>

            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Ionicons name="logo-apple" size={18} color="#292724" />

              <Text className="text-[13px] font-medium text-[#292724]">
                Continuar con Apple
              </Text>
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

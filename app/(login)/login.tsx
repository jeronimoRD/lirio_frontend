import { Link, useRouter } from 'expo-router';
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
const HERO_IMAGE_URI =
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80';

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
          source={{ uri: HERO_IMAGE_URI }}
          className="h-[220px] w-full justify-end overflow-hidden"
        >
          {/* overlay oscuro (equivalente al linear-gradient plano del diseño) */}
          <View className="absolute inset-0 bg-black/15" />

          {/* image-overlay-quote */}
          <Text className="px-5 pb-5 font-['Lora'] text-2xl italic leading-7 text-white">
            Diseñado para tu día a día.
          </Text>
        </ImageBackground>

        {/* login-panel */}
        <View className="gap-6 px-6 pb-4 pt-8">
          {/* brand-logo */}
          <View className="items-center gap-0.5">
            {/* TODO: reemplaza por el nombre real de tu marca */}
            <Text className="font-['Lora'] text-[32px] italic leading-[41px] text-[#1A1A1A]">
              Tu Marca
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wide text-[#B89F8D]">
              Boutique
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
              inputClassName="flex-1 text-sm text-[#1A1A1A]"
            />

            <Field
              control={control}
              name="password"
              label="Contraseña"
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#1A1A1A]"
              rightElement={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Text className="text-xs font-medium text-[#A39E9A]">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />

            {/* forgot-password */}
            {/* TODO: sin lógica de recuperación de contraseña todavía — conectar cuando exista el flujo */}
            <Pressable>
              <Text className="text-right text-xs font-medium text-[#B89F8D]">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>

            {/* MENSAJE DE ERROR */}
            {error && (
              <View className="mb-6 rounded-xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">
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
            className="h-12 rounded-full bg-[#1A1A1A]"
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
            <Text className="text-[11px] font-medium uppercase text-[#A39E9A]">O</Text>
            <View className="h-px flex-1 bg-[#EAE6E1]" />
          </View>

          {/* social-stack */}
          {/* TODO: sin lógica de auth social todavía — solo visual, conectar cuando exista el flujo */}
          <View className="gap-2">
            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Text className="text-[13px] font-medium text-[#1A1A1A]">
                Continuar con Google
              </Text>
            </Pressable>

            <Pressable className="h-12 flex-row items-center justify-center gap-3 rounded-full border border-[#EAE6E1] bg-white">
              <Text className="text-[13px] font-medium text-[#1A1A1A]">
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
                <Text className="font-semibold text-[#1A1A1A]">Crear cuenta</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

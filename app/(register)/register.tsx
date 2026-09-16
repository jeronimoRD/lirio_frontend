import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Field from '../../src/components/Field';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';
import ScreenHeader from '@/components/ScreenHeader';

type FormData = {
  user_name: string;
  email: string;
  password: string;
};

const STYLE_OPTIONS = [
  'Minimalist',
  'Old Money',
  'Boho Chic',
  'Streetwear',
  'Tailored Masculine',
  'Romantic Luxe',
];

// TODO: reemplaza esta URI por tu propia imagen de register
const HERO_IMAGE_URI = require('../../assets/pexels-karen-f-1376469-8883181.jpg');

export default function Register() {
  const router = useRouter();
  const { signUp } = useSession();

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { user_name: '', email: '', password: '' },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await signUp(data.user_name, data.email, data.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Error desconocido');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(login)/login');
    }
  };

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* hero-accent-block */}
        <ImageBackground
          source={HERO_IMAGE_URI}
          resizeMode="cover"
          className="h-[180px] w-full justify-end overflow-hidden"
        >
          <View className="absolute inset-0 bg-black/25" />

          {/* botón atrás flotando sobre la imagen */}
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="absolute left-5 top-5 h-8 w-8 items-center justify-center rounded-full bg-black/30"
          >
            <Text className="text-lg text-white">←</Text>
          </Pressable>

          <Text className="px-5 pb-5 font-['Lora-Italic'] text-xl leading-7 text-white">
            Empieza tu historia con nosotros
          </Text>
        </ImageBackground>

        {/* register-body */}
        <View className="gap-6 px-6 pb-6 pt-6">
          {/* title-block */}
          <View className="items-center gap-0.5">
                <ScreenHeader title="Crear cuenta" />
            <Text className="text-[10px] font-semibold uppercase tracking-wide text-[#6E6B68]">
              Sumate a nuestra comunidad
            </Text>
          </View>

          {/* fields-stack */}
          <View className="gap-4">
            <Field
              control={control}
              name="user_name"
              label="Nombre completo"
              placeholder="Tu nombre"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
            />

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
                  <Text className="text-xs font-medium text-[#A81245]">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {/* preferences-block (solo visual) */}
          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
                Estilo preferido
              </Text>
              <Text className="text-xs text-[#A39E9A]">
                Elige lo que más se parezca a ti (opcional)
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {STYLE_OPTIONS.map((style) => {
                const selected = selectedStyles.includes(style);
                return (
                  <Pressable
                    key={style}
                    onPress={() => toggleStyle(style)}
                    className={`h-9 items-center justify-center rounded-full border px-4 ${
                      selected ? 'border-[#A81245] bg-[#A81245]/10' : 'border-[#EAE6E1] bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        selected ? 'text-[#A81245]' : 'text-[#6E6B68]'
                      }`}
                    >
                      {style}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {error && (
            <View className="rounded-xl bg-red-50 p-4">
              <Text className="text-center text-sm font-medium text-pink-700">{error}</Text>
            </View>
          )}

          {success && (
            <View className="rounded-xl bg-green-50 p-4">
              <Text className="text-center text-sm font-medium text-green-700">
                Usuario registrado correctamente
              </Text>
            </View>
          )}
        </View>

        {/* footer-actions */}
        <View className="items-center gap-4 px-6 pb-8">
          <Button
            text={loading ? 'Registrando...' : 'Crear cuenta'}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="h-12 w-full rounded-full bg-[#A81245]"
            textClassName="text-sm font-semibold text-white"
          />

          {loading && (
            <View className="items-center">
              <ActivityIndicator />
            </View>
          )}

          <Text className="text-center text-[11px] leading-[15px] text-[#A39E9A]">
            Al crear una cuenta aceptas nuestros Términos de servicio y Política de privacidad.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
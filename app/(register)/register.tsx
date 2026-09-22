import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Field from '../../src/components/Field';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';
import { getCategories } from '../../src/api/categories';
import type { Category } from '../../src/types';
import ScreenHeader from '@/components/ScreenHeader';

type FormData = {
  user_name: string;
  email: string;
  password: string;
};

// TODO: reemplaza esta URI por tu propia imagen de register
const HERO_IMAGE_URI = require('../../assets/pexels-karen-f-1376469-8883181.jpg');

export default function Register() {
  const router = useRouter();
  const { signUp } = useSession();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { user_name: '', email: '', password: '' },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleOptions, setStyleOptions] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((categories) => {
        if (active) setStyleOptions(categories);
      })
      .catch(() => {
        if (active) setStyleOptions([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleStyle = (categoryId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(categoryId)
        ? prev.filter((s) => s !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await signUp(data.user_name, data.email, data.password, selectedStyles);
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
        contentContainerStyle={{ paddingBottom: insets.bottom }}
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
              maxLength={50}
              rules={{
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              }}
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
              rules={{
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                maxLength: { value: 128, message: 'Máximo 128 caracteres' },
              }}
              rightElement={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Text className="text-xs font-medium text-[#A81245]">
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {/* preferences-block */}
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
              {styleOptions.map((category) => {
                const selected = selectedStyles.includes(category.id);
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => toggleStyle(category.id)}
                    className={`h-9 items-center justify-center rounded-full border px-4 ${
                      selected ? 'border-[#A81245] bg-[#A81245]/10' : 'border-[#EAE6E1] bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        selected ? 'text-[#A81245]' : 'text-[#6E6B68]'
                      }`}
                    >
                      {category.name}
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
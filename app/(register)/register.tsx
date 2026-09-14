import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Field from '../../src/components/Field';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';

type FormData = {
  user_name: string;
  email: string;
  password: string;
};

// Solo visual por ahora: tu lógica de signUp no recibe preferencias todavía.
const STYLE_OPTIONS = [
  'Minimalist',
  'Old Money',
  'Boho Chic',
  'Streetwear',
  'Tailored Masculine',
  'Romantic Luxe',
];

export default function Register() {
  const router = useRouter();
  const { signUp } = useSession();

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      user_name: '',
      email: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // TODO: sin campo de preferencias en el backend todavía — solo estado visual local.
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
      setError(null);
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
        {/* header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={handleBack} hitSlop={8}>
            <Text className="text-xl text-[#DCC7A8]">←</Text>
          </Pressable>

          <Text className="text-base font-semibold uppercase text-[#DCC7A8]">
            Crear cuenta
          </Text>

          {/* placeholder para centrar el título */}
          <View className="w-6" />
        </View>

        {/* register-body */}
        <View className="gap-6 px-6 pb-6 pt-3">
          {/* intro */}
          <View className="gap-1.5">
            <Text className="font-['Lora'] text-[28px] italic leading-9 text-[#1A1A1A]">
              Bienvenido
            </Text>
            <Text className="text-sm leading-5 text-[#6E6B68]">
              Crea tu cuenta para empezar a descubrir tu estilo.
            </Text>
          </View>

          {/* fields-stack */}
          <View className="gap-4">
            <Field
              control={control}
              name="user_name"
              label="Nombre completo"
              labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
              inputClassName="flex-1 text-sm text-[#1A1A1A]"
            />

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
                      selected
                        ? 'border-[#B89F8D] bg-[#F2ECE7]'
                        : 'border-[#EAE6E1] bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        selected ? 'text-[#1A1A1A]' : 'text-[#6E6B68]'
                      }`}
                    >
                      {style}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* MENSAJE DE ERROR */}
          {error && (
            <View className="rounded-xl bg-red-50 p-4">
              <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
            </View>
          )}

          {/* MENSAJE DE ÉXITO */}
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
            className="h-12 rounded-full bg-[#DCC7A8]"
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

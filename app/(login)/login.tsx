import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  const [error, setError] = useState<string | null>(null);

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
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center">

          {/* CONTENEDOR DEL LOGIN */}
          <View className="w-full max-w-md self-center">

            {/* TÍTULO */}
            <View className="mb-12">
              <Text className="text-center text-3xl font-bold text-neutral-900">
                Iniciar sesión
              </Text>

              <Text className="mt-3 text-center text-base text-neutral-500">
                Ingresa tus datos para acceder a tu cuenta
              </Text>
            </View>

            {/* CAMPOS */}
            <View>

              <View className="mb-8">
                <Field
                  control={control}
                  name="email"
                  label="Correo electrónico"
                  keyboardType="email-address"
                  placeholder="nombre@correo.com"
                />
              </View>

              <View className="mb-8">
                <Field
                  control={control}
                  name="password"
                  label="Contraseña"
                  secureTextEntry
                  placeholder="••••••••"
                />
              </View>

            </View>

            {/* MENSAJE DE ERROR */}
            {error && (
              <View className="mb-6 rounded-xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">
                  {error}
                </Text>
              </View>
            )}

            {/* BOTÓN */}
            <Button
              text={loading ? 'Ingresando...' : 'Iniciar sesión'}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            />

            {/* CARGANDO */}
            {loading && (
              <View className="mt-5 items-center">
                <ActivityIndicator />
              </View>
            )}

            {/* REGISTRO */}
            <View className="mt-10 items-center">
              <Link href="/register" asChild>
                <Text className="text-base text-blue-600">
                  ¿No tienes una cuenta? Crear cuenta
                </Text>
              </Link>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
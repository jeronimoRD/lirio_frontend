
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import Field from '@/components/Field';
import HeroScreen from '@/components/LiquidGlass/HeroScreen';
import { useRegister } from '@/hooks/auth/useRegister';

const HERO_IMAGE = require('../../../assets/pexels-karen-f-1376469-8883181.jpg');
const LABEL = 'text-xs font-semibold uppercase text-[#6E6B68]';

const INPUT_WRAPPER =
  'h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4';

const INPUT = 'flex-1 text-sm text-[#292724]';

export default function Register() {
  const {
    control,
    success,
    showPassword,
    toggleShowPassword,
    selectedStyles,
    styleOptions,
    toggleStyle,
    loadingCategories,
    isSubmitting,
    rootError,
    submit,
    goBack,
  } = useRegister();

  return (
    <HeroScreen
      image={HERO_IMAGE}
      title="Crear cuenta"
      subtitle="Súmate a nuestra comunidad"
      onBack={goBack}
    >
      <View className="gap-6 px-6">
        {/* Campos del formulario */}
        <View className="gap-4">
          <Field
            control={control}
            name="user_name"
            label="Nombre completo"
            placeholder="Tu nombre"
            labelClassName={LABEL}
            inputWrapperClassName={INPUT_WRAPPER}
            inputClassName={INPUT}
          />

          <Field
            control={control}
            name="email"
            label="Correo electrónico"
            keyboardType="email-address"
            placeholder="nombre@correo.com"
            labelClassName={LABEL}
            inputWrapperClassName={INPUT_WRAPPER}
            inputClassName={INPUT}
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
            rightElement={
              <Pressable
                onPress={toggleShowPassword}
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
        </View>

        {/* Preferencias de estilo */}
        <View className="gap-3">
          <View className="gap-1">
            <Text className={LABEL}>Estilo preferido</Text>
            <Text className="text-xs text-[#A39E9A]">
              Elige lo que más se parezca a ti (opcional)
            </Text>
          </View>

          {loadingCategories ? (
            <View className="items-center py-4">
              <ActivityIndicator color="#A81245" />
              <Text className="mt-2 text-xs text-[#A39E9A]">
                Cargando estilos...
              </Text>
            </View>
          ) : styleOptions.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {styleOptions.map((style) => {
                const categoryId = String(style.id);
                const selected = selectedStyles.includes(categoryId);

                return (
                  <Pressable
                    key={categoryId}
                    onPress={() => toggleStyle(categoryId)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className={`h-9 items-center justify-center rounded-full border px-4 ${
                      selected
                        ? 'border-[#A81245] bg-[#A81245]/10'
                        : 'border-[#EAE6E1] bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-medium ${
                        selected
                          ? 'text-[#A81245]'
                          : 'text-[#6E6B68]'
                      }`}
                    >
                      {style.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="text-xs text-[#A39E9A]">
              No fue posible cargar los estilos. Puedes continuar sin elegir
              preferencias.
            </Text>
          )}
        </View>

        {/* Error del registro */}
        {rootError && (
          <View className="rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {rootError}
            </Text>
          </View>
        )}

        {/* Registro exitoso */}
        {success && (
          <View className="rounded-xl bg-green-50 p-4">
            <Text className="text-center text-sm font-medium text-green-700">
              Usuario registrado correctamente
            </Text>
          </View>
        )}
      </View>

      {/* Botón y términos */}
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
            <Text
              numberOfLines={1}
              className="text-sm font-semibold text-white"
            >
              Crear cuenta
            </Text>
          )}
        </Pressable>

        <Text className="text-center text-[11px] leading-[15px] text-[#A39E9A]">
          Al crear una cuenta aceptas nuestros Términos de servicio y Política
          de privacidad.
        </Text>
      </View>
    </HeroScreen>
  );
}

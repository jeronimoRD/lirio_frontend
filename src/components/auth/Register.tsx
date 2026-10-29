
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import Field from '@/components/Field';
import HeroScreen from '@/components/LiquidGlass/HeroScreen';
import { useRegister } from '@/hooks/auth/useRegister';
import GlassSurface from '../LiquidGlass/GlassSurface';

const HERO_IMAGE = require('../../../assets/Romantic Hibiscus and Stargazer Lily Arrangement.png');


const LABEL = 'text-xs font-semibold uppercase text-ink-secondary';

const INPUT_WRAPPER =
  'h-12 flex-row items-center rounded-lg border border-line bg-white px-4';

const INPUT = 'flex-1 text-sm text-ink';

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
                <Text className="text-xs font-medium text-brand">
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
            <Text className="text-xs text-ink-muted">
              Elige lo que más se parezca a ti (opcional)
            </Text>
          </View>

          {loadingCategories ? (
            <View className="items-center py-4">
              <ActivityIndicator color="#A81245" />
              <Text className="mt-2 text-xs text-ink-muted">
                Cargando estilos...
              </Text>
            </View>
          ) : styleOptions.length > 0 ? (
<View className="flex-row flex-wrap gap-2.5">
  {styleOptions.map((style) => {
    const categoryId = String(style.id);
    const selected = selectedStyles.includes(categoryId);

                return (
                  <Pressable
                    key={categoryId}
                    onPress={() => toggleStyle(categoryId)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className="active:opacity-80"
                    style={{
                      borderRadius: 999,
                      shadowColor: selected ? '#A81245' : '#5C4B36',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: selected ? 0.22 : 0.1,
                      shadowRadius: 8,
                      elevation: 2,
                    }}>
                    <GlassSurface
                      intensity={30}
                      tintColor={selected ? 'rgba(168, 18, 69, 0.16)' : 'rgba(255, 255, 255, 0.55)'}
                      style={{
                        height: 38,
                        paddingHorizontal: 16,
                        borderRadius: 999,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: selected ? 'rgba(168, 18, 69, 0.55)' : 'rgba(255, 255, 255, 0.9)',
                      }}>
                      <Text
                        className={`text-[13px] font-semibold ${
                          selected ? 'text-brand' : 'text-ink-secondary'
                        }`}>
                        {style.name}
                      </Text>
                    </GlassSurface>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="text-xs text-ink-muted">
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
          onPress={() => submit()}
          disabled={isSubmitting}
          accessibilityRole="button"
          className="h-12 w-full items-center justify-center rounded-full bg-brand disabled:opacity-50"
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

        <Text className="text-center text-[11px] leading-[15px] text-ink-muted">
          Al crear una cuenta aceptas nuestros Términos de servicio y Política
          de privacidad.
        </Text>
      </View>
    </HeroScreen>
  );
}

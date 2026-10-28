import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import Field from '../Field';
import GarmentPicker from './GarmentPicker';
import GlassIconButton from '@/components/LiquidGlass/GlassIconButton';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import { cardShadow } from '../../constants/theme';
import { useEditPost } from '../../hooks/upload/useEditPost';

const imageShadow = {
  shadowColor: '#292724',
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 20,
  shadowOpacity: 0.15,
  elevation: 6,
};

export default function EditPost() {
  const insets = useSafeAreaInsets();
  const {
    control,
    image,
    loading,
    saving,
    goBack,
    requestUpdate,
    garmentType,
    garmentError,
    selectGarment,
  } = useEditPost();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8]">
        <ActivityIndicator color="#A81245" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        keyboardShouldPersistTaps="handled">
        {/* Imagen como tarjeta flotante, con el botón de atrás encima — mismo lenguaje que PostDetail */}
        <View className="px-5 pt-14">
          <View className="overflow-hidden rounded-[24px]" style={imageShadow}>
            {image && (
              <Image source={{ uri: image }} className="aspect-[4/5] w-full" resizeMode="cover" />
            )}

            <GlassIconButton
              onPress={goBack}
              style={{ position: 'absolute', left: 16, top: 16 }}>
              <ArrowLeft size={20} color="#292724" />
            </GlassIconButton>

            {/* Aviso de solo-lectura: esta pantalla no permite cambiar la foto, solo texto */}
            <GlassSurface
              intensity={30}
              tintColor="rgba(41, 39, 36, 0.35)"
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text className="text-[11px] font-semibold text-white">Foto no editable aquí</Text>
            </GlassSurface>
          </View>
        </View>

        {/* Título de la pantalla */}
        <Text className="px-6 pt-6 font-['Lora-Italic'] text-2xl text-[#A81245]">
          Editar publicación
        </Text>

        {/* Formulario agrupado en una sola tarjeta */}
        <View className="px-6 pt-4">
          <View className="gap-4 rounded-[20px] bg-white p-5" style={cardShadow}>
            <Field
              control={control}
              name="title"
              label="Título"
              placeholder="Ej. Look de otoño"
              autoCapitalize="words"
              maxLength={100}
              rules={{
                required: 'El título es obligatorio',
                maxLength: { value: 100, message: 'Máximo 100 caracteres' },
              }}
              inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-[#FCFAF8] px-4"
              inputClassName="flex-1 text-sm text-[#292724]"
            />

            <Field
              control={control}
              name="description"
              label="Descripción"
              placeholder="Cuéntanos sobre este outfit..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
              rules={{
                required: 'La descripción es obligatoria',
                maxLength: { value: 500, message: 'Máximo 500 caracteres' },
              }}
              inputWrapperClassName="min-h-[120px] flex-row items-start rounded-lg border border-[#EAE6E1] bg-[#FCFAF8] p-4"
              inputClassName="flex-1 text-sm text-[#292724]"
            />

            <GarmentPicker value={garmentType} onChange={selectGarment} error={garmentError} />
          </View>
        </View>

        {/* Botón de guardar */}
        <View className="items-center px-6 pt-6">
          <Pressable
            onPress={requestUpdate}
            disabled={saving}
            className="h-12 w-full items-center justify-center rounded-full bg-[#A81245] disabled:opacity-50">
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-semibold text-white">Guardar cambios</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
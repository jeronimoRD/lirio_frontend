
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Check,
  ImagePlus,
  RefreshCw,
  Sparkles,
} from 'lucide-react-native';

import ScreenHeader from '../ScreenHeader';
import ConfirmModal from '../ConfirmModal';
import Field from '../Field';
import GarmentPicker from './GarmentPicker';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import { useCreatePost } from '../../hooks/upload/useCreatePost';

const COLORS = {
  burgundy: '#A81245',
  secondary: '#6E6B68',
  champagne: '#DCC7A8',
};

function EditorialMark() {
  return (
    <View
      className="flex-row items-center gap-2"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <View className="h-px w-7 bg-[#DCC7A8]" />
      <View className="h-1 w-1 rounded-full bg-[#A81245]" />
      <View className="h-px w-7 bg-[#DCC7A8]" />
    </View>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-4 flex-row items-start gap-3">
      <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full border border-[#DCC7A8] bg-white">
        <Text className="font-['Lora-Italic'] text-[14px] text-[#A81245]">
          {number}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="font-['Lora-Italic'] text-[22px] leading-7 text-[#292724]">
          {title}
        </Text>

        <Text className="mt-1 text-[12px] leading-[18px] text-[#6E6B68]">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

export default function CreatePost() {
  const {
    control,
    goBack,
    image,
    imageError,
    selectImage,
    categories,
    categoryIds,
    categoryError,
    toggleCategory,
    garmentType,
    garmentError,
    selectGarment,
    loading,
    requestCreate,
    confirm,
    confirmMessage,
    onConfirmCreate,
    cancelConfirm,
  } = useCreatePost();

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow pb-5"
        keyboardShouldPersistTaps="handled">
        {/* Cabecera */}
        <View className="px-[18px] pt-2">
          <ScreenHeader
            title="Crear publicación"
            onBack={goBack}
            className="pb-3 pt-10"
          />

          <View className="mb-6 mt-2">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-['Lora-Italic'] text-[29px] leading-[36px] text-[#292724]">
                  Tu estilo merece ser visto.
                </Text>

                <Text className="mt-2 text-[13px] leading-5 text-[#6E6B68]">
                  Comparte ese look que habla un poquito de ti.
                </Text>
              </View>

              <View className="mt-1 h-11 w-11 items-center justify-center rounded-full border border-[#EAE6E1] bg-white">
                <Sparkles
                  size={20}
                  color={COLORS.burgundy}
                  strokeWidth={1.4}
                />
              </View>
            </View>

            <View className="mt-5 flex-row items-center gap-3">
              <EditorialMark />

              <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E6B68]">
                HIBIRIO · EL EDITORIAL
              </Text>

              <View className="h-px flex-1 bg-[#EAE6E1]" />
            </View>
          </View>
        </View>

        <View className="gap-7 px-[18px]">
          {/* 01 — Fotografía */}
          <View>
            <SectionHeading
              number="01"
              title="La fotografía"
              subtitle="Elige la imagen protagonista de tu outfit."
            />

            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
                Foto del outfit
              </Text>

              {image ? (
                <View
                  className="overflow-hidden rounded-[22px] bg-[#EAE6E1]"
                  style={{
                    shadowColor: '#292724',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 3,
                  }}>
                  <Image
                    source={{ uri: image }}
                    className="h-[350px] w-full"
                    resizeMode="cover"
                  />

                  <GlassSurface
                    intensity={35}
                    tintColor="rgba(41, 39, 36, 0.34)"
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      right: 12,
                      borderRadius: 999,
                      paddingHorizontal: 13,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View className="flex-row items-center gap-2">
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-white/20">
                        <Check size={14} color="#FFFFFF" />
                      </View>

                      <Text className="text-[11px] font-semibold text-white">
                        Imagen seleccionada
                      </Text>
                    </View>

                    <Pressable
                      onPress={selectImage}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Cambiar fotografía"
                      className="flex-row items-center gap-1.5">
                      <RefreshCw size={13} color="#FFFFFF" />
                      <Text className="text-[11px] font-semibold text-white">
                        Cambiar
                      </Text>
                    </Pressable>
                  </GlassSurface>

                  <View className="absolute bottom-3 left-3">
                    <GlassSurface
                      intensity={25}
                      tintColor="rgba(41, 39, 36, 0.35)"
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 11,
                        paddingVertical: 7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                      <View className="h-1.5 w-1.5 rounded-full bg-[#DCC7A8]" />
                      <Text className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                        Hibirio · Preview
                      </Text>
                    </GlassSurface>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={selectImage}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar fotografía del outfit"
                  className="overflow-hidden rounded-[22px] border border-dashed border-[#DCC7A8] bg-white">
                  <View className="items-center justify-center px-6 py-10">
                    <View className="mb-4 h-[68px] w-[68px] items-center justify-center rounded-full bg-[#FCFAF8]">
                      <ImagePlus
                        size={29}
                        color={COLORS.burgundy}
                        strokeWidth={1.4}
                      />
                    </View>

                    <EditorialMark />

                    <Text className="mt-4 font-['Lora-Italic'] text-[21px] text-[#292724]">
                      Tu look, en primer plano
                    </Text>

                    <Text className="mt-2 text-center text-[12px] leading-5 text-[#6E6B68]">
                      Selecciona una fotografía para comenzar tu publicación.
                    </Text>

                    <View className="mt-5 flex-row items-center gap-2 rounded-full bg-[#A81245] px-5 py-3">
                      <ImagePlus size={15} color="#FFFFFF" />
                      <Text className="text-[11px] font-semibold text-white">
                        Elegir fotografía
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}

              {!!imageError && (
                <Text className="mt-2 text-[12px] leading-5 text-red-600">
                  {imageError}
                </Text>
              )}
            </View>
          </View>

          {/* 02 — Información */}
          <View>
            <SectionHeading
              number="02"
              title="La historia del look"
              subtitle="Dale contexto a tu outfit y deja que hable por sí solo."
            />

            <View className="gap-5 rounded-[20px] border border-[#EAE6E1] bg-white p-4">
              <Field
                control={control}
                name="title"
                label="Título"
                placeholder="Ej. Un otoño en tonos tierra"
                autoCapitalize="words"
                maxLength={100}
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                rules={{
                  required: 'El título es obligatorio',
                  maxLength: {
                    value: 100,
                    message: 'Máximo 100 caracteres',
                  },
                }}
              />

              <Field
                control={control}
                name="description"
                label="Descripción"
                placeholder="Cuéntanos sobre las prendas, los colores o la inspiración detrás de este outfit..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={500}
                inputWrapperClassName="min-h-[130px] flex-row items-start rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] p-4"
                inputClassName="flex-1 text-sm leading-5 text-[#292724]"
                rules={{
                  required: 'La descripción es obligatoria',
                  maxLength: {
                    value: 500,
                    message: 'Máximo 500 caracteres',
                  },
                }}
              />
            </View>
          </View>

          {/* 03 — Tipo de prenda */}
          <View>
            <SectionHeading
              number="03"
              title="El tipo de prenda"
              subtitle="Indica qué tipo de prenda protagoniza tu publicación."
            />

            <GarmentPicker
              value={garmentType}
              onChange={selectGarment}
              error={garmentError}
            />
          </View>

          {/* 04 — Estilos */}
          <View>
            <SectionHeading
              number="04"
              title="Tu identidad visual"
              subtitle="Elige uno o varios estilos que representen tu outfit."
            />

            <View className="gap-3">
              <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
                Estilos
              </Text>

              <Text className="text-xs text-[#A39E9A]">
                Puedes seleccionar varios estilos.
              </Text>

              <View className="flex-row flex-wrap gap-2.5">
                {categories.map((style) => {
                  const selected = categoryIds.includes(style.id);

                  return (
                    <Pressable
                      key={style.id}
                      onPress={() => toggleCategory(style.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={style.name}
                      className="active:opacity-80"
                      style={{
                        borderRadius: 999,
                        shadowColor: selected
                          ? COLORS.burgundy
                          : '#5C4B36',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: selected ? 0.22 : 0.1,
                        shadowRadius: 8,
                        elevation: 2,
                      }}>
                      <GlassSurface
                        intensity={30}
                        tintColor={
                          selected
                            ? 'rgba(168, 18, 69, 0.16)'
                            : 'rgba(255, 255, 255, 0.55)'
                        }
                        style={{
                          minHeight: 38,
                          paddingHorizontal: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: selected
                            ? 'rgba(168, 18, 69, 0.55)'
                            : 'rgba(255, 255, 255, 0.9)',
                        }}>
                        <Text
                          className={`text-[13px] font-semibold ${
                            selected
                              ? 'text-[#A81245]'
                              : 'text-[#6E6B68]'
                          }`}>
                          {style.name}
                        </Text>
                      </GlassSurface>
                    </Pressable>
                  );
                })}
              </View>

              {!!categoryError && (
                <Text className="text-[12px] leading-5 text-red-600">
                  {categoryError}
                </Text>
              )}
            </View>
          </View>

          {/* Nota editorial */}
          <View className="overflow-hidden rounded-[18px] border border-[#EAE6E1] bg-white p-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-[#FCFAF8]">
                <Sparkles
                  size={17}
                  color={COLORS.burgundy}
                  strokeWidth={1.4}
                />
              </View>

              <View className="flex-1">
                <Text className="font-['Lora-Italic'] text-[17px] text-[#292724]">
                  Cada estilo cuenta algo.
                </Text>

                <Text className="mt-1 text-[12px] leading-5 text-[#6E6B68]">
                  Comparte tu inspiración y descubre nuevas formas de expresar
                  tu personalidad a través de la moda.
                </Text>
              </View>
            </View>
          </View>

          {/* Publicar */}
          <View className="gap-3 pb-8">
            <Pressable
              onPress={requestCreate}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Publicar outfit"
              className="min-h-[54px] flex-row items-center justify-center gap-2 rounded-full bg-[#A81245] px-5 disabled:opacity-50"
              style={{
                shadowColor: COLORS.burgundy,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 3,
              }}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text className="text-[12px] font-semibold tracking-[0.04em] text-white">
                    Publicar mi outfit
                  </Text>
                </>
              )}
            </Pressable>

            <Text className="text-center text-[10px] leading-4 text-[#A09B95]">
              Tu estilo, tu historia. Comparte tu inspiración con Hibirio.
            </Text>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirm}
        title="¿Crear publicación?"
        message={confirmMessage}
        confirmLabel="Publicar"
        loading={loading}
        onConfirm={onConfirmCreate}
        onCancel={cancelConfirm}
      />
    </View>
  );
}

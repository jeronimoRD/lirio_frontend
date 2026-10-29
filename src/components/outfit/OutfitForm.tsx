import { useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Field from '../Field';
import ScreenHeader from '../ScreenHeader';
import OutfitCollage from '../outfits/OutfitCollage';
import { garmentLabel } from '../upload/GarmentPicker';
import { useOutfitForm, type OutfitSection } from '../../hooks/outfit/useOutfitForm';
import { GARMENT_TYPES, type GarmentType, type Post } from '../../types';

const VISIBILITY_OPTIONS = [
  {
    value: false,
    label: 'Privado',
    description: 'Solo tú lo ves en tu ropero.',
  },
  {
    value: true,
    label: 'Público',
    description: 'Aparece en la búsqueda de outfits para todos.',
  },
] as const;

export default function OutfitForm() {
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const nameSectionRef = useRef<View>(null);
  const piecesSectionRef = useRef<View>(null);
  const nameInputRef = useRef<TextInput>(null);

  const focusSection = (section: OutfitSection) => {
    const target = section === 'name' ? nameSectionRef.current : piecesSectionRef.current;

    if (!target || !contentRef.current) return;

    target.measureLayout(
      contentRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });

        if (section === 'name') {
          nameInputRef.current?.focus();
        }
      },
      () => {},
    );
  };

  const {
    isEdit,
    control,
    options,
    selected,
    togglePiece,
    previewItems,
    isPublic,
    setIsPublic,
    loading,
    loadError,
    piecesError,
    submitError,
    saving,
    onSubmit,
    goBack,
  } = useOutfitForm({ onFirstError: focusSection });

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: insets.bottom + 36,
        }}>
        <ScreenHeader
          title={isEdit ? 'Editar outfit' : 'Crear outfit'}
          onBack={goBack}
        />

        <View className="mb-7 mt-4 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-['Lora-Italic'] text-[28px] leading-[36px] text-[#292724]">
              Combina tu look.
            </Text>

            <Text className="mt-2 text-[13px] leading-5 text-[#6E6B68]">
              Elige una prenda de cada tipo, de tus publicaciones o de las que guardaste.
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#EAE6E1] bg-white">
            <Sparkles size={20} color="#A81245" strokeWidth={1.4} />
          </View>
        </View>

        {loading && (
          <View className="items-center py-16">
            <ActivityIndicator color="#A81245" />
            <Text className="mt-3 text-xs text-[#A09B95]">Cargando tus prendas…</Text>
          </View>
        )}

        {!loading && !!loadError && (
          <View className="rounded-[20px] border border-[#E8C9CE] bg-[#FBF0F1] p-5">
            <Text className="text-[13px] leading-5 text-[#A81245]">{loadError}</Text>
          </View>
        )}

        {!loading && !loadError && (
          <View ref={contentRef} className="gap-7">
            {/* 01 — Nombre */}
            <View ref={nameSectionRef} className="gap-3">
              <SectionTitle number="01" title="El nombre" />

              <Field
                control={control}
                name="name"
                inputRef={nameInputRef}
                label="Nombre"
                placeholder="Ej. Un otoño en tonos tierra"
                maxLength={80}
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-white px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                rules={{
                  required: 'El nombre es obligatorio',
                  maxLength: { value: 80, message: 'Máximo 80 caracteres' },
                }}
              />
            </View>

            {/* 02 — Prendas */}
            <View ref={piecesSectionRef} className="gap-5">
              <SectionTitle
                number="02"
                title="Las prendas"
                subtitle="Una por tipo. Toca otra para cambiarla."
              />

              {GARMENT_TYPES.map((type) => (
                <GarmentRow
                  key={type}
                  type={type}
                  options={options.filter((post) => post.garmentType === type)}
                  selectedId={selected[type]}
                  onSelect={togglePiece}
                />
              ))}

              {!!piecesError && (
                <Text className="text-[12px] leading-5 text-red-600">{piecesError}</Text>
              )}
            </View>

            {/* 03 — Vista previa */}
            <View className="gap-3">
              <SectionTitle number="03" title="Vista previa" />

              <View className="aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[24px] border border-[#A81245]/25 bg-white">
                {previewItems.length > 0 ? (
                  <OutfitCollage items={previewItems} />
                ) : (
                  <Text className="px-6 text-center text-[13px] leading-5 text-[#A09B95]">
                    Elige prendas para verlas aquí.
                  </Text>
                )}
              </View>
            </View>

            {/* 04 — Visibilidad */}
            <View className="gap-3">
              <SectionTitle number="04" title="Visibilidad" />

              <View className="flex-row gap-3">
                {VISIBILITY_OPTIONS.map((option) => {
                  const active = isPublic === option.value;

                  return (
                    <Pressable
                      key={option.label}
                      onPress={() => setIsPublic(option.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      className={`flex-1 gap-1 rounded-[18px] border p-4 ${
                        active
                          ? 'border-[#A81245] bg-[#A81245]/10'
                          : 'border-[#EAE6E1] bg-white'
                      }`}>
                      <Text
                        className={`text-[14px] font-semibold ${
                          active ? 'text-[#A81245]' : 'text-[#292724]'
                        }`}>
                        {option.label}
                      </Text>

                      <Text className="text-[11px] leading-4 text-[#6E6B68]">
                        {option.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {!!submitError && (
              <View className="rounded-[20px] border border-[#E8C9CE] bg-[#FBF0F1] p-4">
                <Text className="text-[13px] leading-5 text-[#A81245]">{submitError}</Text>
              </View>
            )}

            <Pressable
              onPress={onSubmit}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel={isEdit ? 'Guardar cambios del outfit' : 'Guardar outfit'}
              className="min-h-[54px] flex-row items-center justify-center gap-2 rounded-full bg-[#A81245] px-5 disabled:opacity-50">
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Check size={16} color="#FFFFFF" />
                  <Text className="text-[12px] font-semibold tracking-[0.04em] text-white">
                    {isEdit ? 'Guardar cambios' : 'Guardar outfit'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View>
      <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#A81245]">
        {number} · {title}
      </Text>

      {!!subtitle && <Text className="mt-1 text-[12px] text-[#6E6B68]">{subtitle}</Text>}
    </View>
  );
}

function GarmentRow({
  type,
  options,
  selectedId,
  onSelect,
}: {
  type: GarmentType;
  options: Post[];
  selectedId?: string;
  onSelect: (post: Post) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-[12px] font-semibold text-[#292724]">{garmentLabel(type)}</Text>

      {options.length === 0 ? (
        <Text className="text-[12px] leading-5 text-[#A09B95]">
          No tienes prendas de este tipo todavía.
        </Text>
      ) : (
        <FlatList
          horizontal
          data={options}
          keyExtractor={(post) => post.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => {
            const selected = item.id === selectedId;

            return (
              <Pressable
                onPress={() => onSelect(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${garmentLabel(type)}: ${item.title}`}
                className={`w-[84px] overflow-hidden rounded-[14px] border-2 bg-white ${
                  selected ? 'border-[#A81245]' : 'border-transparent'
                }`}>
                <Image source={{ uri: item.image }} resizeMode="cover" className="h-[104px] w-full" />

                <View className="flex-row items-center justify-center gap-1 px-1 py-1.5">
                  {selected && <Check size={11} color="#A81245" />}
                  <Text
                    numberOfLines={1}
                    className={`text-[10px] font-semibold ${
                      selected ? 'text-[#A81245]' : 'text-[#6E6B68]'
                    }`}>
                    {selected ? 'Elegida' : item.title}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

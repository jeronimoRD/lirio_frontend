import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { ImagePlus } from 'lucide-react-native';

import ScreenHeader from '../ScreenHeader';
import ConfirmModal from '../ConfirmModal';
import Field from '../Field';
import { useCreatePost } from '../../hooks/upload/useCreatePost';

export default function CreatePost() {
  const {
    control,
    goBack,
    image,
    imageError,
    selectImage,
    categories,
    category,
    categoryError,
    showCategories,
    toggleCategories,
    selectCategory,
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
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled">
        {/* header */}
        <ScreenHeader title="Crear publicación" onBack={goBack} className="px-6 pb-4 pt-14" />

        {/* body */}
        <View className="gap-5 px-6 pb-6 pt-2">
          <Field
            control={control}
            name="title"
            label="Título"
            placeholder="Ej. Look de otoño"
            autoCapitalize="words"
            maxLength={100}
            inputWrapperClassName="h-12 flex-row items-center rounded-lg border border-[#EAE6E1] bg-white px-4"
            inputClassName="flex-1 text-sm text-[#292724]"
            rules={{
              required: 'El título es obligatorio',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            }}
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
            inputWrapperClassName="min-h-[120px] flex-row items-start rounded-lg border border-[#EAE6E1] bg-white p-4"
            inputClassName="flex-1 text-sm text-[#292724]"
            rules={{
              required: 'La descripción es obligatoria',
              maxLength: { value: 500, message: 'Máximo 500 caracteres' },
            }}
          />

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase text-[#6E6B68]">Categoría</Text>

            <Pressable
              onPress={toggleCategories}
              className="h-12 flex-row items-center justify-between rounded-lg border border-[#EAE6E1] bg-white px-4">
              <Text className="text-sm text-[#292724]">
                {category ? category.name : 'Selecciona una categoría'}
              </Text>

              <Text className="text-[#6E6B68]">{showCategories ? '▲' : '▼'}</Text>
            </Pressable>

            {showCategories && (
              <View className="overflow-hidden rounded-lg border border-[#EAE6E1] bg-white">
                {categories.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => selectCategory(item)}
                    className="border-b border-[#EAE6E1] px-4 py-3 last:border-b-0">
                    <Text className="text-sm text-[#292724]">{item.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {categoryError && <Text className="text-xs text-red-600">{categoryError}</Text>}
          </View>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase text-[#6E6B68]">Foto del outfit</Text>

            {image ? (
              <Pressable onPress={selectImage}>
                <Image
                  source={{ uri: image }}
                  className="h-64 w-full rounded-2xl"
                  resizeMode="cover"
                />
                <View className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-white">Cambiar</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={selectImage}
                className="h-40 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#DCC7A8] bg-white">
                <ImagePlus size={26} color="#A81245" />
                <Text className="text-sm font-semibold text-[#A81245]">Seleccionar imagen</Text>
              </Pressable>
            )}

            {imageError && <Text className="text-xs text-red-600">{imageError}</Text>}
          </View>
        </View>

        {/* footer */}
        <View className="items-center gap-3 px-6 pb-8">
          <Pressable
            onPress={requestCreate}
            disabled={loading}
            className="h-12 w-full items-center justify-center rounded-full bg-[#A81245] disabled:opacity-50">
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-semibold text-white">Publicar</Text>
            )}
          </Pressable>
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
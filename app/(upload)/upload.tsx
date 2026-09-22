import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ImagePlus } from 'lucide-react-native';

import { createPost } from '../../src/api/posts';
import { getCategories } from '../../src/api/categories';
import ConfirmModal from '../../src/components/ConfirmModal';
import Field from '../../src/components/Field';
import ScreenHeader from '../../src/components/ScreenHeader';
import type { Category } from '../../src/types';

type FormData = {
  title: string;
  description: string;
};

export default function CreatePost() {
  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: { title: '', description: '' },
  });

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log('Error cargando categorías:', error);
      }
    }

    loadCategories();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  async function selectImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Necesitas permitir el acceso a tus imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError(null);
    }
  }

  const requestCreate = handleSubmit(() => {
    setCategoryError(null);
    setImageError(null);

    if (!category) {
      setCategoryError('Selecciona una categoría.');
      return;
    }

    if (!image) {
      setImageError('Selecciona una imagen.');
      return;
    }

    setConfirm(true);
  });

  const onConfirmCreate = async () => {
    if (loading || !category || !image) return;

    const { title, description } = getValues();

    setLoading(true);

    try {
      await createPost(title, description, image, category.id);
      setConfirm(false);
      router.replace('/(tabs)/profile');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear el post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled">
        {/* header */}
        <ScreenHeader title="Crear publicación" onBack={handleBack} className="px-6 pb-4 pt-14" />

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
              onPress={() => setShowCategories(!showCategories)}
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
                    onPress={() => {
                      setCategory(item);
                      setShowCategories(false);
                      setCategoryError(null);
                    }}
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
        message={`Se publicará el outfit "${getValues().title}".`}
        confirmLabel="Publicar"
        loading={loading}
        onConfirm={onConfirmCreate}
        onCancel={() => setConfirm(false)}
      />
    </View>
  );
}

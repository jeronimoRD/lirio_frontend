import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { getPost, updatePost } from '../../src/api/posts';

export default function EditUpload() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {

        if (!id) return;

      try {
        const post = await getPost(id);

        setTitle(post.title);
        setDescription(post.description);
        setImage(post.image);
      } catch (error) {
        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el post.',
        );

        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  async function handleUpdatePost() {
    if (!id) return;

    if (!title.trim()) {
      Alert.alert('Falta información', 'Escribe un título.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Falta información', 'Escribe una descripción.');
      return;
    }

    try {
      setSaving(true);

      await updatePost(
        id,
        title.trim(),
        description.trim(),
      );

      Alert.alert(
        'Post actualizado',
        'Tu publicación se actualizó correctamente.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/profile'),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el post.',
      );
    } finally {
      setSaving(false);
    }
  }

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
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* header */}
        <View className="flex-row items-center justify-between px-6 pb-4 pt-14">
          <Pressable onPress={handleBack} hitSlop={8}>
            <ArrowLeft size={22} color="#A81245" />
          </Pressable>

          <Text className="font-['Lora-Italic'] text-xl text-[#A81245]">
            Editar publicación
          </Text>

          <View className="w-[22px]" />
        </View>

        {/* body */}
        <View className="gap-5 px-6 pb-6 pt-2">
          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
              Título
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholder="Ej. Look de otoño"
              placeholderTextColor="#A09B95"
              className="h-12 rounded-lg border border-[#EAE6E1] bg-white px-4 text-sm text-[#292724]"
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
              Descripción
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              placeholder="Cuéntanos sobre este outfit..."
              placeholderTextColor="#A09B95"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="min-h-[120px] rounded-lg border border-[#EAE6E1] bg-white p-4 text-sm text-[#292724]"
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
              Foto del outfit
            </Text>

            {image && (
              <Image
                source={{ uri: image }}
                className="h-64 w-full rounded-2xl"
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        {/* footer */}
        <View className="items-center gap-3 px-6 pb-8">
          <Pressable
            onPress={handleUpdatePost}
            disabled={saving}
            className="h-12 w-full items-center justify-center rounded-full bg-[#A81245] disabled:opacity-50"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-semibold text-white">
                Guardar cambios
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
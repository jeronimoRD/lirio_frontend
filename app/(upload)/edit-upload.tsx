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

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};

const imageShadow = {
  shadowColor: '#292724',
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 20,
  shadowOpacity: 0.15,
  elevation: 6,
};

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

      await updatePost(id, title.trim(), description.trim());

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
        error instanceof Error ? error.message : 'No se pudo actualizar el post.',
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
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Imagen como tarjeta flotante, con el botón de atrás encima — mismo lenguaje que PostDetail */}
        <View className="px-5 pt-14">
          <View className="overflow-hidden rounded-[24px]" style={imageShadow}>
            {image && (
              <Image
                source={{ uri: image }}
                className="w-full"
                style={{ aspectRatio: 4 / 5 }}
                resizeMode="cover"
              />
            )}

            <Pressable
              onPress={handleBack}
              hitSlop={8}
              className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
                shadowOpacity: 0.15,
                elevation: 3,
              }}
            >
              <ArrowLeft size={20} color="#292724" />
            </Pressable>

            {/* Aviso de solo-lectura: esta pantalla no permite cambiar la foto, solo texto */}
            <View
              className="absolute bottom-4 left-4 rounded-full px-3 py-1.5"
              style={{ backgroundColor: 'rgba(41,39,36,0.55)' }}
            >
              <Text className="text-[11px] font-semibold text-white">
                Foto no editable aquí
              </Text>
            </View>
          </View>
        </View>

        {/* Título de la pantalla */}
        <Text className="px-6 pt-6 font-['Lora-Italic'] text-2xl text-[#A81245]">
          Editar publicación
        </Text>

        {/* Formulario agrupado en una sola tarjeta */}
        <View className="px-6 pt-4">
          <View className="gap-4 rounded-[20px] bg-white p-5" style={cardShadow}>
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
                className="h-12 rounded-lg border border-[#EAE6E1] bg-[#FCFAF8] px-4 text-sm text-[#292724]"
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
                className="min-h-[120px] rounded-lg border border-[#EAE6E1] bg-[#FCFAF8] p-4 text-sm text-[#292724]"
              />
              <Text className="text-right text-[11px] text-[#A09B95]">
                {description.length}/500
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de guardar */}
        <View className="items-center px-6 pt-6">
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
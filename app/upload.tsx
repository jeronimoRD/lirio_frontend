import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { createPost } from '../src/api/posts';
import { useRouter } from 'expo-router';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function selectImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'Necesitas permitir el acceso a tus imágenes.',
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleCreatePost() {
    if (!title.trim()) {
      Alert.alert('Falta información', 'Escribe un título.');
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        'Falta información',
        'Escribe una descripción.',
      );
      return;
    }

    if (!image) {
      Alert.alert(
        'Falta información',
        'Selecciona una imagen.',
      );
      return;
    }

    try {
      setLoading(true);

      await createPost(
        title,
        description,
        image,
      );

      Alert.alert(
        'Post creado',
        'Tu publicación se creó correctamente.',
      );

      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo crear el post.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-[#FCFAF8] p-5">
      <Pressable
        onPress={() => router.push('/(tabs)/home')}
        className="mb-5 self-start rounded-xl border border-[#F2C8D5] bg-[#FFF0F4] px-4 py-2"
      >
        <Text className="font-semibold text-[#A83D62]">
          ← Volver al inicio
        </Text>
      </Pressable>

      <Text className="mb-6 text-2xl font-bold text-[#1A1A1A]">
        Crear publicación
      </Text>

      <Text className="mb-2 font-semibold text-[#1A1A1A]">
        Título
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Escribe el título"
        className="mb-5 rounded-xl border border-[#F2C8D5] bg-white p-4 text-[#1A1A1A]"
      />

      <Text className="mb-2 font-semibold text-[#1A1A1A]">
        Descripción
      </Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Escribe una descripción"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        className="mb-5 rounded-xl border border-[#F2C8D5] bg-white p-4 text-[#1A1A1A]"
      />

      <Pressable
        onPress={selectImage}
        className="mb-5 items-center justify-center rounded-xl border border-[#F2C8D5] bg-[#FFF0F4] p-4"
      >
        <Text className="font-semibold text-[#A83D62]">
          {image
            ? 'Cambiar imagen'
            : 'Seleccionar imagen'}
        </Text>
      </Pressable>

      {image && (
        <Image
          source={{ uri: image }}
          className="mb-5 h-56 w-full rounded-xl"
          resizeMode="cover"
        />
      )}

      <Pressable
        onPress={handleCreatePost}
        disabled={loading}
        className="items-center rounded-xl bg-[#D96C91] p-4"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-bold text-white">
            Publicar
          </Text>
        )}
      </Pressable>
    </View>
  );
}
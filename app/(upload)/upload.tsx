import { useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, ImagePlus } from 'lucide-react-native';

import { createPost } from '../../src/api/posts';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    }
  }

  async function handleCreatePost() {
    if (!title.trim()) {
      Alert.alert('Falta información', 'Escribe un título.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Falta información', 'Escribe una descripción.');
      return;
    }

    if (!image) {
      Alert.alert('Falta información', 'Selecciona una imagen.');
      return;
    }

    try {
      setLoading(true);
      await createPost(title, description, image);

      Alert.alert('Post creado', 'Tu publicación se creó correctamente.');

      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo crear el post.',
      );
    } finally {
      setLoading(false);
    }
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
            Crear publicación
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
                className="h-40 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#DCC7A8] bg-white"
              >
                <ImagePlus size={26} color="#A81245" />
                <Text className="text-sm font-semibold text-[#A81245]">
                  Seleccionar imagen
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* footer */}
        <View className="items-center gap-3 px-6 pb-8">
          <Pressable
            onPress={handleCreatePost}
            disabled={loading}
            className="h-12 w-full items-center justify-center rounded-full bg-[#A81245] disabled:opacity-50"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-sm font-semibold text-white">Publicar</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
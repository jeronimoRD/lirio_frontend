import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';

import ScreenHeader from '../ScreenHeader';
import { useSaved } from './../../hooks/tabs/useSaved';

export default function Saved() {
  const { savedPosts, loading, error } = useSaved();

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScreenHeader title="Guardados" />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-24 pt-4">
        {loading && (
          <View className="items-center py-16">
            <ActivityIndicator color="#A81245" />
          </View>
        )}

        {error && (
          <View className="rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
          </View>
        )}

        {!loading && !error && savedPosts.length === 0 && (
          <View className="rounded-2xl border border-[#EAE6E1] bg-white p-6">
            <Text className="text-center text-sm text-[#6E6B68]">
              Aún no has guardado ningún outfit. Toca el corazón en un post del feed para guardarlo
              aquí.
            </Text>
          </View>
        )}

        {!loading && !error && savedPosts.length > 0 && (
          <View className="flex-row flex-wrap gap-3">
            {savedPosts.map((post) => (
              <Image
                key={post.id}
                source={{ uri: post.image }}
                className="rounded-[14px]"
                style={{ width: '48%', height: 220 }}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
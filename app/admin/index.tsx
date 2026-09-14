import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getAdminUsers } from '../../src/api/admin';
import { getCategories } from '../../src/api/categories';

function OptionCard({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm active:opacity-80"
    >
      <Text className="text-lg font-semibold text-neutral-900">{title}</Text>
      <Text className="mt-1 text-sm text-neutral-500">{subtitle}</Text>
    </Pressable>
  );
}

export default function AdminIndex() {
  const router = useRouter();

  const [userCount, setUserCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([getAdminUsers(), getCategories()])
      .then(([users, categories]) => {
        if (active) {
          setUserCount(users.length);
          setCategoryCount(categories.length);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar los datos',
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 py-10"
    >
      <View className="mx-auto w-full max-w-md">
        <Text className="mb-6 text-3xl font-bold text-neutral-900">
          Panel de administración
        </Text>

        {error && (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        {userCount === null || categoryCount === null ? (
          <View className="items-center py-10">
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <OptionCard
              title="Usuarios"
              subtitle={`${userCount} cuenta${userCount === 1 ? '' : 's'} registrada${userCount === 1 ? '' : 's'}`}
              onPress={() => router.push('/admin/users')}
            />

            <OptionCard
              title="Categorías"
              subtitle={`${categoryCount} categoría${categoryCount === 1 ? '' : 's'}`}
              onPress={() => router.push('/admin/categories')}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
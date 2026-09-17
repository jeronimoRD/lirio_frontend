import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { ChevronRight, Tag, Users } from 'lucide-react-native';

import { getAdminUsers } from '../../src/api/admin';
import { getCategories } from '../../src/api/categories';
import { useSession } from '../../src/session/context';

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};

function OptionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 flex-row items-center gap-4 rounded-2xl bg-white p-5 active:opacity-80"
      style={cardShadow}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F4EEE7]">
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-[#292724]">{title}</Text>
        <Text className="mt-0.5 text-sm text-[#6E6B68]">{subtitle}</Text>
      </View>

      <ChevronRight size={18} color="#A09B95" />
    </Pressable>
  );
}

export default function AdminIndex() {
  const router = useRouter();
  const { signOut } = useSession();

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
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="px-5 py-8"
    >
      <View className="mx-auto w-full max-w-md">
        <View className="mb-1">
          <Text className="text-[22px] font-bold uppercase tracking-wide text-[#292724]">
            Panel de administración
          </Text>
        </View>
        <Text className="mb-6 text-xs font-medium uppercase tracking-wide text-[#6E6B68]">
          Gestión de usuarios, categorías y posts
        </Text>

        {error && (
          <View className="mb-4 rounded-2xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        {userCount === null || categoryCount === null ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#4A3728" />
          </View>
        ) : (
          <>
            <OptionCard
              icon={<Users size={20} color="#4A3728" />}
              title="Usuarios"
              subtitle={`${userCount} cuenta${userCount === 1 ? '' : 's'} registrada${userCount === 1 ? '' : 's'}`}
              onPress={() => router.push('/(admin)/users')}
            />

            <OptionCard
              icon={<Tag size={20} color="#4A3728" />}
              title="Categorías"
              subtitle={`${categoryCount} categoría${categoryCount === 1 ? '' : 's'}`}
              onPress={() => router.push('/(admin)/categories')}
            />
          </>
        )}

        <Pressable
          onPress={signOut}
          className="mt-4 h-12 w-full items-center justify-center rounded-2xl border border-red-200 bg-white"
        >
          <Text className="text-sm font-semibold text-red-600">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
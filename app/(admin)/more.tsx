import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Flag, LogOut, Tag } from 'lucide-react-native';

import { useSession } from '../../src/session/context';
import AdminBrandHeader from '../../src/components/admin/AdminBrandHeader';
import { cardShadow } from '../../src/constants/theme';

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
      style={cardShadow}>
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

export default function AdminMore() {
  const router = useRouter();
  const { signOut } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FAF8F6]">
      <AdminBrandHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 + insets.bottom }}>
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6">
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">Más</Text>
          </View>

          <OptionCard
            icon={<Tag size={20} color="#241E1B" />}
            title="Categorías"
            subtitle="Gestionar las categorías de outfits"
            onPress={() => router.push('/(admin)/categories')}
          />

          <OptionCard
            icon={<Flag size={20} color="#241E1B" />}
            title="Reportes"
            subtitle="Moderar contenido reportado"
            onPress={() => router.push('/(admin)/reports')}
          />

          <Pressable
            onPress={signOut}
            className="mt-2 h-12 w-full flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white active:opacity-80">
            <LogOut size={16} color="#DC2626" />
            <Text className="text-sm font-semibold text-red-600">Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

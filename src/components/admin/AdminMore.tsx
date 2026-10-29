import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Flag, LogOut, Shirt, Tag, X } from 'lucide-react-native';

import { useSession } from '../../session/context';
import { adminColors, cardShadow } from '../../constants/theme';

function OptionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 flex-row items-center gap-4 rounded-2xl bg-white p-5 active:opacity-80"
      style={cardShadow}>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-icon-well">
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-ink">{title}</Text>
        <Text className="mt-0.5 text-sm text-ink-secondary">{subtitle}</Text>
      </View>

      <ChevronRight size={18} color={adminColors.faint} />
    </Pressable>
  );
}

export default function AdminMore({ onClose = () => {} }: { onClose?: () => void }) {
  const router = useRouter();
  const { signOut } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-admin-screen">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 24 + insets.bottom,
        }}>
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6 min-h-12 flex-row items-center justify-between">
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">Más</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar menú"
              className="h-12 w-12 items-center justify-center rounded-full active:bg-admin-tint">
              <X size={22} color={adminColors.ink} />
            </Pressable>
          </View>

          <OptionCard
            icon={<Tag size={20} color={adminColors.ink} />}
            title="Categorías"
            subtitle="Gestionar las categorías de outfits"
            onPress={() => {
              onClose();
              router.push('/(admin)/categories');
            }}
          />

          <OptionCard
            icon={<Shirt size={20} color={adminColors.ink} />}
            title="Tipos de prenda"
            subtitle="Gestionar Camiseta, Pantalón, Abrigo..."
            onPress={() => {
              onClose();
              router.push('/(admin)/garment-types');
            }}
          />

          <OptionCard
            icon={<Flag size={20} color={adminColors.ink} />}
            title="Reportes"
            subtitle="Moderar contenido reportado"
            onPress={() => {
              onClose();
              router.push('/(admin)/reports');
            }}
          />

          <Pressable
            onPress={() => {
              onClose();
              signOut();
            }}
            className="mt-2 h-12 w-full flex-row items-center justify-center gap-2 rounded-2xl border border-admin-danger-line bg-white active:opacity-80">
            <LogOut size={16} color={adminColors.danger} />
            <Text className="text-sm font-semibold text-admin-danger">Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

export default function NewOutfitCard() {
  const openNewOutfit = () => router.push('/outfit/new');

  return (
    <Pressable
      onPress={openNewOutfit}
      accessibilityRole="button"
      accessibilityLabel="Crear outfit"
      className="aspect-[3/5] items-center justify-center gap-3 overflow-hidden rounded-[20px] border-[1.5px] border-dashed border-[#A09B95] bg-[#F1EFEC] px-4 active:opacity-70">
      <View className="h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-dashed border-[#A09B95] bg-white/60">
        <Plus size={24} color="#7D7873" strokeWidth={1.8} />
      </View>

      <Text className="text-center text-[14px] font-semibold text-[#6E6B68]">
        Crear outfit
      </Text>

      <Text className="text-center text-[11px] leading-4 text-[#8F8A84]">
        Combina una prenda de cada tipo
      </Text>
    </Pressable>
  );
}

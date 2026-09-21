import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminBrandHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="items-center justify-center px-4"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: 16,
        backgroundColor: '#241E1B',
      }}>
      <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-white">Hibirio</Text>
      <Text className="text-[11px] font-light leading-[13px] text-white/70">
        Panel de administración
      </Text>
    </View>
  );
}

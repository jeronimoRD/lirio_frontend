import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface Props {
  title: string;
  onBack?: () => void;
  className?: string;
}

export default function ScreenHeader({ title, onBack, className = '' }: Props) {
  const titleClass = "font-['Lora-Italic'] text-xl text-[#A81245]";

  if (onBack) {
    return (
      <View className={`flex-row items-center justify-between ${className}`}>
        <Pressable onPress={onBack} hitSlop={8}>
          <ArrowLeft size={22} color="#A81245" />
        </Pressable>
        <Text className={`flex-1 text-center ${titleClass}`}>{title}</Text>
        <View className="w-[22px]" />
      </View>
    );
  }

  return (
    <View className="items-center border-b border-[#EAE6E1] px-5 pb-3 pt-14">
      <Text className={titleClass}>{title}</Text>
    </View>
  );
}
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

const SIDE = 40;

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  className = '',
}: Props) {
  const insets = useSafeAreaInsets();

  // Si el llamador define su propio espaciado, se respeta; si no, usa el seguro.
  const spacing = className || 'px-5 pb-3';
  const style = className ? undefined : { paddingTop: insets.top + 12 };

  return (
    <View className={spacing} style={style}>
      <View className="flex-row items-center justify-between">
        <View style={{ width: SIDE, height: SIDE }} className="justify-center">
          {onBack && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Pressable
                onPress={onBack}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Volver"
                className="h-10 w-10 items-center justify-center rounded-full border border-[#EAE6E1] bg-white active:opacity-70"
                style={{
                  shadowColor: 'rgba(92, 75, 54, 0.12)',
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 8,
                  shadowOpacity: 1,
                  elevation: 2,
                }}>
                <ArrowLeft size={20} color="#A81245" />
              </Pressable>
            </Animated.View>
          )}
        </View>

        <Animated.View
          entering={FadeInDown.duration(420)}
          className="flex-1 items-center px-2">
          <Text
            numberOfLines={1}
            className="font-['Lora-Italic'] text-[22px] leading-7 text-[#A81245]">
            {title}
          </Text>
          {!!subtitle && (
            <Text
              numberOfLines={1}
              className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A09B95]">
              {subtitle}
            </Text>
          )}
        </Animated.View>

        <View style={{ width: SIDE, height: SIDE }} className="items-end justify-center">
          {right}
        </View>
      </View>

      {/* Ornamento */}
      <Animated.View
        entering={FadeIn.delay(180).duration(500)}
        className="mt-2.5 flex-row items-center justify-center gap-1.5">
        <View className="h-px w-8 bg-[#DCC7A8]" />
        <View className="h-1 w-1 rounded-full bg-[#A81245]" />
        <View className="h-px w-8 bg-[#DCC7A8]" />
      </Animated.View>
    </View>
  );
}
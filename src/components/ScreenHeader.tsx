import type { ReactNode, RefObject } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';

import GlassSurface from '@/components/LiquidGlass/GlassSurface';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
  /** Header fijo arriba con fondo difuminado */
  sticky?: boolean;
  /** Ref del BlurTargetView que envuelve el contenido (obligatorio en Android) */
  blurTarget?: RefObject<View | null>;
  /** Altura real del header, para el paddingTop del scroll */
  onHeightChange?: (height: number) => void;
}

const SIDE = 40;

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  className = '',
  sticky = false,
  blurTarget,
  onHeightChange,
}: Props) {
  const insets = useSafeAreaInsets();

  const spacing = className || 'px-5 pb-2.5';
  const style = className ? undefined : { paddingTop: insets.top + 10 };

  const stickyStyle = sticky
    ? ({ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 } as const)
    : undefined;

  return (
    <View
      className={spacing}
      style={[style, stickyStyle]}
      onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}>
      {/* Fondo de vidrio del header sticky */}
      {sticky && (
        <>
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={Platform.OS === 'android' ? 45 : 60}
            tint="light"
            blurTarget={blurTarget}
            blurMethod="dimezisBlurView"
          />
          {/* Velo crema para que el texto siempre se lea */}
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(252, 250, 248, 0.6)' }]}
          />
          {/* Línea fina inferior */}
          <View
            pointerEvents="none"
            className="absolute bottom-0 left-0 right-0 h-px bg-[#DCC7A8]/40"
          />
        </>
      )}

      <View className="flex-row items-center justify-between">
        {/* Volver */}
        <View style={{ width: SIDE, height: SIDE }} className="justify-center">
          {onBack && (
            <Animated.View entering={FadeIn.duration(300)}>
              <GlassSurface
                intensity={25}
                tintColor="rgba(168, 18, 69, 0.10)"
                style={{
                  width: SIDE,
                  height: SIDE,
                  borderRadius: 999,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(168, 18, 69, 0.18)',
                }}>
                <Pressable
                  onPress={onBack}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Volver"
                  className="h-full w-full items-center justify-center active:opacity-60">
                  <ArrowLeft size={20} color="#A81245" />
                </Pressable>
              </GlassSurface>
            </Animated.View>
          )}
        </View>

        {/* Título */}
        <Animated.View entering={FadeInDown.duration(420)} className="flex-1 items-center px-2">
          <Text
            numberOfLines={1}
            className="font-['Lora-Italic'] text-[26px] leading-[34px] text-[#A81245]">
            {title}
          </Text>
          {!!subtitle && (
            <Text
              numberOfLines={1}
              className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09B95]">
              {subtitle}
            </Text>
          )}
        </Animated.View>

        {/* Acción derecha */}
        <View style={{ width: SIDE, height: SIDE }} className="items-end justify-center">
          {right}
        </View>
      </View>

      {/* Ornamento */}
      <View className="mt-2 flex-row items-center justify-center gap-2">
        <Animated.View
          entering={FadeIn.delay(180).duration(500)}
          className="h-px w-10 bg-[#DCC7A8]"
        />
        <Animated.View
          entering={ZoomIn.delay(260).duration(350)}
          className="h-[7px] w-[7px] rotate-45 bg-[#A81245]"
        />
        <Animated.View
          entering={FadeIn.delay(180).duration(500)}
          className="h-px w-10 bg-[#DCC7A8]"
        />
      </View>
    </View>
  );
}
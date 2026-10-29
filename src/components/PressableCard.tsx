import { useRef } from 'react';
import { Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SLOP = 12;
const PRESSED_SCALE = 1.03;

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  className?: string;
};

/**
 * Tarjeta pulsable que no se confunde con un deslizamiento: si el dedo se mueve
 * más de unos píxeles entre que baja y sube, no cuenta como toque. Al presionarla
 * crece un poco con transición. La escala va en un contenedor externo para no
 * interferir con los estilos de NativeWind del Pressable.
 */
export default function PressableCard({
  onPress,
  onPressIn,
  onPressOut,
  onTouchStart,
  onTouchMove,
  ...props
}: Props) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        pressRetentionOffset={30}
        {...props}
        onPressIn={(event) => {
          scale.value = withTiming(PRESSED_SCALE, { duration: 150 });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withTiming(1, { duration: 150 });
          onPressOut?.(event);
        }}
        onTouchStart={(event) => {
          const { pageX, pageY } = event.nativeEvent;
          start.current = { x: pageX, y: pageY };
          moved.current = false;
          onTouchStart?.(event);
        }}
        onTouchMove={(event) => {
          const origin = start.current;
          const { pageX, pageY } = event.nativeEvent;
          if (origin && (Math.abs(pageX - origin.x) > SLOP || Math.abs(pageY - origin.y) > SLOP)) {
            moved.current = true;
          }
          onTouchMove?.(event);
        }}
        onPress={(event: GestureResponderEvent) => {
          if (!moved.current) onPress?.(event);
        }}
      />
    </Animated.View>
  );
}

import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ImagePlus, Shirt } from 'lucide-react-native';

import { cardShadowLg } from '../constants/theme';

export type MenuAnchor = { x: number; y: number; width: number; height: number };

type Route = '/upload' | '/outfit/new';

const OPTIONS: { label: string; route: Route; icon: typeof ImagePlus }[] = [
  { label: 'Publicación', route: '/upload', icon: ImagePlus },
  { label: 'Outfit', route: '/outfit/new', icon: Shirt },
];

const MENU_WIDTH = 200;
const GAP = 14;
const EDGE = 12;
const SPRING = { damping: 16, stiffness: 220, mass: 0.7 };

interface Props {
  visible: boolean;
  anchor: MenuAnchor | null;
  onClose: () => void;
}

export default function QuickCreateMenu({ visible, anchor, onClose }: Props) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [mounted, setMounted] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withSpring(1, SPRING);
      return;
    }

    progress.value = withTiming(0, { duration: 140 }, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
  }, [visible, progress]);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 28 },
      { scale: 0.8 + 0.2 * progress.value },
    ],
  }));

  const left = anchor
    ? Math.min(
        Math.max(anchor.x + anchor.width / 2 - MENU_WIDTH / 2, EDGE),
        width - MENU_WIDTH - EDGE,
      )
    : 0;

  const bottom = anchor ? height - anchor.y + GAP : 0;

  const choose = (route: Route) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      visible={mounted && !!anchor}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Cerrar menú"
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.menu, cardShadowLg, { left, bottom }, menuStyle]}>
        {OPTIONS.map((option, index) => {
          const Icon = option.icon;

          return (
            <Pressable
              key={option.route}
              onPress={() => choose(option.route)}
              accessibilityRole="button"
              accessibilityLabel={`Crear ${option.label.toLowerCase()}`}
              className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-screen ${
                index > 0 ? 'border-t border-line' : ''
              }`}>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-icon-well">
                <Icon size={18} color="#A81245" />
              </View>

              <Text className="text-[14px] font-semibold text-ink">
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAE6E1',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
});

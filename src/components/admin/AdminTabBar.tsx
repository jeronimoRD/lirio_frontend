import { useState, type RefObject } from 'react';
import { Image, LayoutGrid, Shirt, Users } from 'lucide-react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Pressable, Text, View, type LayoutChangeEvent, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { adminColors } from '../../constants/theme';
import GlassSurface from '../LiquidGlass/GlassSurface';

type AdminTabBarProps = {
  active: number;
  onChange: (index: number) => void;
  scrollPosition: SharedValue<number>;
  blurTarget: RefObject<ViewInstance | null>;
};

type TabDef = { key: string; label: string; icon: typeof LayoutGrid };

const TABS: TabDef[] = [
  { key: 'home', label: 'Resumen', icon: LayoutGrid },
  { key: 'users', label: 'Usuarios', icon: Users },
  { key: 'posts', label: 'Posts', icon: Image },
  { key: 'outfits', label: 'Outfits', icon: Shirt },
];

const BAR_HEIGHT = 64;
const BAR_PADDING = 8;
const SIDE_MARGIN = 20;
const BOTTOM_GAP = 10;

const barShadow = {
  borderRadius: BAR_HEIGHT / 2,
  shadowColor: '#5C4B36',
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 20,
  shadowOpacity: 0.18,
  elevation: 8,
};

export default function AdminTabBar({
  active,
  onChange,
  scrollPosition,
  blurTarget,
}: AdminTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const slotWidth = barWidth > 0 ? (barWidth - BAR_PADDING * 2) / TABS.length : 0;
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollPosition.value * slotWidth }],
  }));
  const onLayout = (event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: SIDE_MARGIN,
        right: SIDE_MARGIN,
        bottom: insets.bottom + BOTTOM_GAP,
      }}>
      <View style={barShadow}>
        <GlassSurface
          blurTarget={blurTarget}
          intensity={60}
          style={{ height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2 }}>
          <View
            onLayout={onLayout}
            style={{
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: BAR_PADDING,
            }}>
            {slotWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  {
                    position: 'absolute',
                    left: BAR_PADDING,
                    top: 8,
                    width: slotWidth,
                    height: BAR_HEIGHT - 16,
                    borderRadius: (BAR_HEIGHT - 16) / 2,
                    backgroundColor: adminColors.tint,
                    borderWidth: 1,
                    borderColor: adminColors.tint,
                  },
                  pillStyle,
                ]}
              />
            )}

            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const selected = index === active;
              const color = selected ? adminColors.brand : adminColors.muted;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => onChange(index)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  className="flex-1 items-center justify-center gap-1 py-1.5">
                  <Icon size={20} color={color} strokeWidth={selected ? 2 : 1.8} />
                  <Text className="text-[10px] font-semibold" style={{ color }}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassSurface>
      </View>
    </View>
  );
}

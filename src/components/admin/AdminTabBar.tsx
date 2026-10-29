import { Image, LayoutGrid, MoreHorizontal, Users } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AdminTabBarProps = {
  active: number;
  onChange: (index: number) => void;
};

type TabDef = { key: string; label: string; icon: typeof LayoutGrid };

const TABS: TabDef[] = [
  { key: 'home', label: 'Resumen', icon: LayoutGrid },
  { key: 'users', label: 'Usuarios', icon: Users },
  { key: 'posts', label: 'Posts', icon: Image },
  { key: 'more', label: 'Más', icon: MoreHorizontal },
];

export default function AdminTabBar({ active, onChange }: AdminTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center border-t border-admin-line bg-white px-3"
      style={{ height: 64 + insets.bottom, paddingBottom: insets.bottom }}>
      {TABS.map((tab, index) => {
        const Icon = tab.icon;
        const selected = index === active;
        const color = selected ? '#A91243' : '#7A6E65';

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
  );
}

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
      style={{
        backgroundColor: '#FFFFFF',
        borderTopColor: '#EDE7E1',
        borderTopWidth: 1,
        height: 64 + insets.bottom,
        paddingHorizontal: 12,
        paddingBottom: insets.bottom,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
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
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              paddingVertical: 6,
            }}>
            <Icon size={20} color={color} strokeWidth={selected ? 2 : 1.8} />
            <Text style={{ fontSize: 10, fontWeight: '600', color }}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurTargetView } from 'expo-blur';
import { Heart, House, Plus, Search, UserRound } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

import HomeScreen from './home';
import ExploreScreen from './explore';
import SavedScreen from './saved';
import ProfileScreen from './profile';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import TabPager, { type TabPagerHandle } from '@/components/TabPager';
import FloatingTabBar from '@/components/LiquidGlass/FloatingTabBar';
import {
  DEFAULT_CLEARANCE,
  TabBarClearanceContext,
} from '@/components/LiquidGlass/TabBarClearance';

const TAB_ROUTES = ['/home', '/explore', '/saved', '/profile'] as const;

// Propiedad del componente TabsLayout
//  que permite personalizar su apariencia y comportamiento.
// y futuros cambios en la interfaz de usuario si se desean a futuro.
const BAR_HEIGHT = 64;
const SIDE_MARGIN = 20;
const BOTTOM_GAP = 10;

// Sombra de la barra flotante, para dar un efecto de profundidad y realismo en la interfaz de usuario.
const barShadow = {
  borderRadius: BAR_HEIGHT / 2,
  shadowColor: '#5C4B36',
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 20,
  shadowOpacity: 0.18,
  elevation: 8,
};

function UploadButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/upload')}
      className="h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/70 bg-brand"
      style={{
        shadowColor: '#A81245',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
      }}>
      <Plus size={22} color="#FFFFFF" />
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const [index, setIndex] = useState(() => {
    const i = TAB_ROUTES.indexOf(pathname as (typeof TAB_ROUTES)[number]);
    return i === -1 ? 0 : i;
  });
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [clearance, setClearance] = useState(DEFAULT_CLEARANCE);
  const pagerRef = useRef<TabPagerHandle>(null);
  const pagerIndexRef = useRef(index);
  // Contenido que la tab bar difumina (necesario para el blur en Android), porque es imitación del efecto de vidrio líquido.
  const blurTargetRef = useRef<ViewInstance | null>(null);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    const i = TAB_ROUTES.indexOf(pathname as (typeof TAB_ROUTES)[number]);
    if (i !== -1 && i !== index) {
      setIndex(i);
    }
  }

  useEffect(() => {
    const i = TAB_ROUTES.indexOf(pathname as (typeof TAB_ROUTES)[number]);
    if (i === -1 || i === pagerIndexRef.current) return;
    pagerIndexRef.current = i;
    pagerRef.current?.setPage(i);
  }, [pathname]);

  const onPageSelected = (event: { nativeEvent: { position: number } }) => {
    const i = event.nativeEvent.position;
    pagerIndexRef.current = i;
    setIndex(i);
    syncUrl(i);
  };

  // Cambia la página del TabPager y sincroniza la URL con el índice de la pestaña seleccionada.
  // Si la pestaña seleccionada es la misma que la actual, no hace nada.
  // Si la diferencia entre la pestaña actual y la seleccionada es mayor a 1, cambia la página sin animación.
  // Esto es útil para saltar de la primera a la última pestaña (o viceversa) sin animación, evitando un efecto visual extraño.
  const goTo = (i: number) => {
    const current = pagerIndexRef.current;
    if (i === current) return;

    pagerIndexRef.current = i;
    setIndex(i);

    if (Math.abs(i - current) > 1) {
      pagerRef.current?.setPageWithoutAnimation(i);
    } else {
      pagerRef.current?.setPage(i);
    }
    syncUrl(i);
  };

  const syncUrl = (i: number) => {
    const target = TAB_ROUTES[i];
    if (target !== pathname) router.navigate(target);
  };

  const home = (
    <View key="home" className="flex-1 bg-screen">
      <HomeScreen />
    </View>
  );
  const explore = (
    <View key="explore" className="flex-1 bg-screen">
      <ExploreScreen />
    </View>
  );
  const saved = (
    <View key="saved" className="flex-1 bg-screen">
      <SavedScreen />
    </View>
  );
  const profile = (
    <View key="profile" className="flex-1 bg-screen">
      <ProfileScreen active={index === 3} />
    </View>
  );

  return (
    <TabBarClearanceContext.Provider value={clearance}>
    <View className="flex-1 bg-screen">
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <TabPager ref={pagerRef} index={index} onPageSelected={onPageSelected}>
          {home}
          {explore}
          {saved}
          {profile}
        </TabPager>
      </BlurTargetView>

      {/* Tab bar flotante */}
        <FloatingTabBar
          index={index}
          onChange={goTo}
          blurTarget={blurTargetRef}
          onClearanceChange={setClearance}
        />
    </View>
    </TabBarClearanceContext.Provider>
  );
}

function TabButton({
  label,
  icon: Icon,
  active,
  onPress,
}: {
  label: string;
  icon: typeof House;
  active: boolean;
  onPress: () => void;
}) {
  const color = active ? '#A81245' : '#6E6B68';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className="flex-1 items-center justify-center">
      <View
        className={`items-center gap-[2px] rounded-full px-2.5 py-1.5 ${
          active ? 'bg-brand/10' : ''
        }`}>
        <Icon size={21} color={color} />
        <Text className="text-[10px] font-semibold" style={{ color }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
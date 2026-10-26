import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
      className="h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/70 bg-[#A81245]"
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
  const pagerRef = useRef<TabPagerHandle>(null);
  const pagerIndexRef = useRef(index);
  // Contenido que la tab bar difumina (necesario para el blur en Android), porque es imitación del efecto de vidrio líquido.
  const blurTargetRef = useRef<View | null>(null);

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

  const goTo = (i: number) => {
    pagerIndexRef.current = i;
    setIndex(i);
    pagerRef.current?.setPageWithoutAnimation(i);
    syncUrl(i);
  };

  const syncUrl = (i: number) => {
    const target = TAB_ROUTES[i];
    if (target !== pathname) router.navigate(target);
  };

  const home = (
    <View key="home" className="flex-1 bg-[#FCFAF8]">
      <HomeScreen />
    </View>
  );
  const explore = (
    <View key="explore" className="flex-1 bg-[#FCFAF8]">
      <ExploreScreen />
    </View>
  );
  const saved = (
    <View key="saved" className="flex-1 bg-[#FCFAF8]">
      <SavedScreen />
    </View>
  );
  const profile = (
    <View key="profile" className="flex-1 bg-[#FCFAF8]">
      <ProfileScreen active={index === 3} />
    </View>
  );

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <TabPager ref={pagerRef} index={index} onPageSelected={onPageSelected}>
          {home}
          {explore}
          {saved}
          {profile}
        </TabPager>
      </BlurTargetView>

      {/* Tab bar flotante */}
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
            blurTarget={blurTargetRef}
            intensity={60}
            style={{ height: BAR_HEIGHT, borderRadius: BAR_HEIGHT / 2 }}>
            <View className="h-full flex-row items-center px-2">
              <TabButton label="Home" icon={House} active={index === 0} onPress={() => goTo(0)} />
              <TabButton label="Explore" icon={Search} active={index === 1} onPress={() => goTo(1)} />
              <View className="flex-1" />
              <TabButton label="Saved" icon={Heart} active={index === 2} onPress={() => goTo(2)} />
              <TabButton label="Profile" icon={UserRound} active={index === 3} onPress={() => goTo(3)} />
            </View>
          </GlassSurface>
        </View>

        {/* El + vive fuera del vidrio para poder sobresalir, o sino se perdería la estetica buscada en la interfaz */}
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 0, right: 0, top: -22, alignItems: 'center' }}>
          <UploadButton />
        </View>
      </View>
    </View>
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
          active ? 'bg-[#A81245]/10' : ''
        }`}>
        <Icon size={21} color={color} />
        <Text className="text-[10px] font-semibold" style={{ color }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, House, Plus, Search, UserRound } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

import HomeScreen from './home';
import ExploreScreen from './explore';
import SavedScreen from './saved';
import ProfileScreen from './profile';
import TabPager, { type TabPagerHandle } from '@/components/TabPager';

const TAB_ROUTES = ['/home', '/explore', '/saved', '/profile'] as const;

const PAGE_STYLE = { flex: 1, backgroundColor: '#FCFAF8' } as const;

function UploadButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/upload')}
      style={{
        top: -18,
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: '#A81245',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#A81245',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
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

  // External URL changes (deep links, redirects, tab bar) reflect in the page.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    const i = TAB_ROUTES.indexOf(pathname as (typeof TAB_ROUTES)[number]);
    if (i !== -1 && i !== index) {
      setIndex(i);
    }
  }

  // Move the native pager to follow the URL (no-op on web).
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

  // Keep the URL pointing at the active tab so that push/back restores it.
  const syncUrl = (i: number) => {
    const target = TAB_ROUTES[i];
    if (target !== pathname) router.navigate(target);
  };

  const home = (
    <View key="home" style={PAGE_STYLE}>
      <HomeScreen active={index === 0} />
    </View>
  );
  const explore = (
    <View key="explore" style={PAGE_STYLE}>
      <ExploreScreen />
    </View>
  );
  const saved = (
    <View key="saved" style={PAGE_STYLE}>
      <SavedScreen />
    </View>
  );
  const profile = (
    <View key="profile" style={PAGE_STYLE}>
      <ProfileScreen active={index === 3} />
    </View>
  );

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#A81245',
            tabBarInactiveTintColor: '#A09B95',
            tabBarStyle: {
            backgroundColor: '#FCFAF8',
            borderTopColor: '#EAE6E1',
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            },
        }}
        >
        <Tabs.Screen
            name="home"
            options={{ title: 'Inicio', tabBarIcon: ({ color }) => <House size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="explore"
            options={{ title: 'Busqueda', tabBarIcon: ({ color }) => <Search size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="upload-placeholder"
            options={{
            title: '',
            tabBarButton: () => (
                <View style={{ flex: 1, alignItems: 'center' }}>
                <UploadButton />
                </View>
            ),
            }}
            listeners={{ tabPress: (e) => e.preventDefault() }}
        />
        <Tabs.Screen
            name="saved"
            options={{ title: 'Guardados', tabBarIcon: ({ color }) => <Heart size={22} color={color} /> }}
        />
        <Tabs.Screen
            name="profile"
            options={{ title: 'Perfil', tabBarIcon: ({ color }) => <UserRound size={22} color={color} /> }}
        />
        </Tabs>
    );
}

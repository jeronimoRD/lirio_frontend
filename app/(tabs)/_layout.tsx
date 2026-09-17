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
      <HomeScreen />
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
    <View style={{ flex: 1, backgroundColor: '#FCFAF8' }}>
      <TabPager ref={pagerRef} index={index} onPageSelected={onPageSelected}>
        {home}
        {explore}
        {saved}
        {profile}
      </TabPager>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FCFAF8',
          borderTopColor: '#EAE6E1',
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        }}>
        <TabButton label="Home" icon={House} active={index === 0} onPress={() => goTo(0)} />
        <TabButton label="Explore" icon={Search} active={index === 1} onPress={() => goTo(1)} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <UploadButton />
        </View>
        <TabButton label="Saved" icon={Heart} active={index === 2} onPress={() => goTo(2)} />
        <TabButton label="Profile" icon={UserRound} active={index === 3} onPress={() => goTo(3)} />
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
  const color = active ? '#A81245' : '#A09B95';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}>
      <Icon size={22} color={color} />
      <Text style={{ fontSize: 11, fontWeight: '600', color }}>{label}</Text>
    </Pressable>
  );
}

import { useRef, useState } from 'react';
import { View, type ViewInstance } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { useSharedValue } from 'react-native-reanimated';

import AdminBrandHeader from './AdminBrandHeader';
import AdminResumen from './AdminResumen';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminOutfits from './AdminOutfits';
import AdminTabBar from './AdminTabBar';
import TabPager, { type TabPagerHandle } from '../TabPager';

const TAB_TITLES = ['Resumen', 'Usuarios', 'Post', 'Outfits'];

export default function AdminPager() {
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<TabPagerHandle>(null);
  const blurTargetRef = useRef<ViewInstance | null>(null);
  const scrollPosition = useSharedValue(0);

  const handlePageSelected = (event: { nativeEvent: { position: number } }) => {
    const position = event.nativeEvent.position;
    setIndex(position);
    scrollPosition.value = position;
  };

  const handlePageScroll = (event: { nativeEvent: { position: number; offset: number } }) => {
    scrollPosition.value = event.nativeEvent.position + event.nativeEvent.offset;
  };

  const goTo = (i: number) => {
    pagerRef.current?.setPageWithoutAnimation(i);
    setIndex(i);
    scrollPosition.value = i;
  };

  return (
    <View className="flex-1 bg-admin-screen">
      <AdminBrandHeader title={TAB_TITLES[index]} />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <TabPager
          ref={pagerRef}
          index={index}
          onPageSelected={handlePageSelected}
          onPageScroll={handlePageScroll}>
          <View key="resumen" className="flex-1 bg-admin-screen">
            <AdminResumen showHeader={false} />
          </View>
          <View key="users" className="flex-1 bg-admin-screen">
            <AdminUsers showHeader={false} />
          </View>
          <View key="posts" className="flex-1 bg-admin-screen">
            <AdminPosts showHeader={false} />
          </View>
          <View key="outfits" className="flex-1 bg-admin-screen">
            <AdminOutfits showHeader={false} />
          </View>
        </TabPager>
      </BlurTargetView>

      <AdminTabBar
        active={index}
        onChange={goTo}
        scrollPosition={scrollPosition}
        blurTarget={blurTargetRef}
      />
    </View>
  );
}

import { useRef, useState } from 'react';
import { View } from 'react-native';

import AdminResumen from './AdminResumen';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminMore from './AdminMore';
import AdminTabBar from './AdminTabBar';
import TabPager, { type TabPagerHandle } from '../TabPager';

export default function AdminPager() {
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<TabPagerHandle>(null);

  const handlePageSelected = (event: { nativeEvent: { position: number } }) => {
    setIndex(event.nativeEvent.position);
  };

  const goTo = (i: number) => {
    pagerRef.current?.setPageWithoutAnimation(i);
    setIndex(i);
  };

  return (
    <View className="flex-1 bg-[#FAF8F6]">
      <TabPager ref={pagerRef} index={index} onPageSelected={handlePageSelected}>
        <View key="resumen" className="flex-1 bg-[#FAF8F6]">
          <AdminResumen />
        </View>
        <View key="users" className="flex-1 bg-[#FAF8F6]">
          <AdminUsers />
        </View>
        <View key="posts" className="flex-1 bg-[#FAF8F6]">
          <AdminPosts />
        </View>
        <View key="more" className="flex-1 bg-[#FAF8F6]">
          <AdminMore />
        </View>
      </TabPager>

      <AdminTabBar active={index} onChange={goTo} />
    </View>
  );
}

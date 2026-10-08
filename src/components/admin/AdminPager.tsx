import { useRef, useState } from 'react';
import { View } from 'react-native';

import AdminResumen from './AdminResumen';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminMore from './AdminMore';
import AdminTabBar from './AdminTabBar';
import TabPager, { type TabPagerHandle } from '../TabPager';

const PAGE_STYLE = { flex: 1, backgroundColor: '#FAF8F6' } as const;

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
    <View style={{ flex: 1, backgroundColor: '#FAF8F6' }}>
      <TabPager ref={pagerRef} index={index} onPageSelected={handlePageSelected}>
        <View key="resumen" style={PAGE_STYLE}>
          <AdminResumen />
        </View>
        <View key="users" style={PAGE_STYLE}>
          <AdminUsers />
        </View>
        <View key="posts" style={PAGE_STYLE}>
          <AdminPosts />
        </View>
        <View key="more" style={PAGE_STYLE}>
          <AdminMore />
        </View>
      </TabPager>

      <AdminTabBar active={index} onChange={goTo} />
    </View>
  );
}

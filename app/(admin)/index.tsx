import { useRef, useState } from 'react';
import { View } from 'react-native';

import ResumenScreen from './_resumen';
import MoreScreen from './more';
import PostsScreen from './posts';
import UsersScreen from './users';
import AdminTabBar from '../../src/components/admin/AdminTabBar';
import TabPager, { type TabPagerHandle } from '../../src/components/TabPager';

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
          <ResumenScreen />
        </View>
        <View key="users" style={PAGE_STYLE}>
          <UsersScreen />
        </View>
        <View key="posts" style={PAGE_STYLE}>
          <PostsScreen />
        </View>
        <View key="more" style={PAGE_STYLE}>
          <MoreScreen />
        </View>
      </TabPager>

      <AdminTabBar active={index} onChange={goTo} />
    </View>
  );
}

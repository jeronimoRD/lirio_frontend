import { forwardRef, type ReactNode } from 'react';
import PagerView from 'react-native-pager-view';
import { useTabPager, type TabPagerHandle } from '../hooks/general/useTabPager';

export type { TabPagerHandle };

export type TabPagerProps = {
  index: number;
  onPageSelected: (event: { nativeEvent: { position: number } }) => void;
  children: ReactNode[];
};

const TabPager = forwardRef<TabPagerHandle, TabPagerProps>(
  ({ index, onPageSelected, children }, ref) => {
    const { pagerRef } = useTabPager(ref);

    return (
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, backgroundColor: '#FCFAF8' }}
        initialPage={index}
        offscreenPageLimit={1}
        onPageSelected={onPageSelected}>
        {children}
      </PagerView>
    );
  }
);

TabPager.displayName = 'TabPager';

export default TabPager;

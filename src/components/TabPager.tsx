import { forwardRef, type ReactNode, useImperativeHandle, useRef } from 'react';
import PagerView from 'react-native-pager-view';

export type TabPagerHandle = {
  setPage: (page: number) => void;
  setPageWithoutAnimation: (page: number) => void;
};

export type TabPagerProps = {
  index: number;
  onPageSelected: (event: { nativeEvent: { position: number } }) => void;
  children: ReactNode[];
};

const TabPager = forwardRef<TabPagerHandle, TabPagerProps>(
  ({ index, onPageSelected, children }, ref) => {
    const pagerRef = useRef<PagerView>(null);

    useImperativeHandle(ref, () => ({
      setPage: (page: number) => pagerRef.current?.setPage(page),
      setPageWithoutAnimation: (page: number) => pagerRef.current?.setPageWithoutAnimation(page),
    }));

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

import { useImperativeHandle, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import type { ForwardedRef } from 'react';

export type TabPagerHandle = {
  setPage: (page: number) => void;
  setPageWithoutAnimation: (page: number) => void;
};

export const useTabPager = (ref: ForwardedRef<TabPagerHandle>) => {
  const pagerRef = useRef<PagerView>(null);

  useImperativeHandle(ref, () => ({
    setPage: (page: number) => {
      pagerRef.current?.setPage(page);
    },
    setPageWithoutAnimation: (page: number) => {
      pagerRef.current?.setPageWithoutAnimation(page);
    },
  }));

  return {
    pagerRef,
  };
};

import { type ReactNode } from 'react';

export type TabPagerHandle = {
  setPage: (page: number) => void;
  setPageWithoutAnimation: (page: number) => void;
};

export type TabPagerProps = {
  index: number;
  onPageSelected: (event: { nativeEvent: { position: number } }) => void;
  children: ReactNode[];
};

const TabPager = ({ index, children }: TabPagerProps) => {
  return <>{children[index]}</>;
};

TabPager.displayName = 'TabPager';

export default TabPager;

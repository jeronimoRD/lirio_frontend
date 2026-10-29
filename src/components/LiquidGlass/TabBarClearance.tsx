import { createContext, useContext } from 'react';

export const DEFAULT_CLEARANCE = 120;

export const TabBarClearanceContext = createContext(DEFAULT_CLEARANCE);

export function useTabBarClearance() {
  return useContext(TabBarClearanceContext);
}

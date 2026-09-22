import type { ViewStyle } from 'react-native';

export const colors = {
  background: '#FCFAF8',
  primary: '#A81245',
  accent: '#DCC7A8',
  iconWell: '#F4EEE7',
  border: '#EAE6E1',
  textStrong: '#292724',
  textMuted: '#6E6B68',
  textFaint: '#A09B95',
} as const;

export const cardShadow: ViewStyle = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
};

export const cardShadowLg: ViewStyle = {
  shadowColor: 'rgba(92, 75, 54, 0.12)',
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 16,
  shadowOpacity: 1,
  elevation: 3,
};
import type { ViewStyle } from 'react-native';

import { colors as palette, glass as glassTokens } from './tokens';

export const colors = {
  background: palette.screen,
  primary: palette.brand,
  accent: palette.beige,
  iconWell: palette['icon-well'],
  border: palette.line,
  textStrong: palette.ink,
  textMuted: palette['ink-secondary'],
  textFaint: palette['ink-muted'],
} as const;

export const adminColors = {
  brand: palette['admin-brand'],
  brown: palette['admin-brown'],
  ink: palette['admin-ink'],
  muted: palette['admin-muted'],
  faint: palette['admin-faint'],
  tint: palette['admin-tint'],
  danger: palette['admin-danger'],
} as const;

export const glass = glassTokens;

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